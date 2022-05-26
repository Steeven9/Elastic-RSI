package ch.usi.inf.va2022.elasticrsi

import kotlinx.coroutines.Dispatchers.Default
import kotlinx.coroutines.Dispatchers.IO
import kotlinx.coroutines.withContext
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException
import java.net.Authenticator
import java.net.PasswordAuthentication
import java.net.URL
import java.util.*
import javax.net.ssl.HttpsURLConnection

object RsiTopicUtil {
    private const val ENV_RSI_USER = "RSI_API_USER"
    private const val ENV_RSI_PWD = "RSI_API_PWD"
    private const val BASE_URL = "https://akamai5.rsi.ch/rsi-api/app/news/v0/article/%1\$d"
    private const val BUFFER_SIZE = 2048

    private val REGEX_ID = Regex("^/g/\\d+(\\?.+)?$")
    private val REGEX_INTEGER = Regex("\\d+")
    private val TOPIC_BLACKLIST: List<String>

    init {
        val blackListUrl = RsiTopicUtil::class.java.getResource("/topics_blacklist.txt")
        TOPIC_BLACKLIST = if (blackListUrl == null) {
            System.err.println("Missing topics_blacklist.txt resource")
            emptyList()
        } else {
            blackListUrl.readText().lines()
        }
    }

    suspend fun buildTopicsFromPath(path: String): List<String> = withContext(Default) {
        extractTopics(
            if (path matches REGEX_ID) {
                // Retrieve using the API
                val resourceId = path.run {
                    val idxParams = indexOf("?")
                    if (idxParams >= 0) {
                        substring(3, idxParams)
                    } else {
                        substring(3)
                    }
                }.toInt()
                val infoJson = getInfo(resourceId)

                if (infoJson.has("article")) {
                    listOf(
                        infoJson.getJSONObject("article").getString("type"),
                        infoJson.getJSONObject("article").getString("contentType"),
                    )
                } else {
                    listOf()
                }
            } else {
                // Retrieve from the URL
                path.split("/")
            }
        ).toList()
    }

    private fun extractTopics(iterable: Iterable<String>): Set<String> {
        return iterable.asSequence()
            .map {
                // Remove url parameters
                val questionMarkIdx = it.indexOf('?')
                if (questionMarkIdx >= 0) {
                    it.substring(0, questionMarkIdx)
                } else {
                    it
                }
            }
            .filter {
                it.isNotEmpty() && !it.endsWith(".html")
            }
            .map {
                // Normalize
                it.lowercase(Locale.ROOT)
                    .replace("-", "")
            }
            .filter {
                // 30+ chars are usually ids
                it.length < 30
            }
            .filter {
                // Skip scripts and parameters
                !it.startsWith("&") && !it.endsWith(".jsp")
            }
            .filter {
                // Skip words in blacklist and integer-only values
                !(it in TOPIC_BLACKLIST || it matches REGEX_INTEGER)
            }
            .toSet()
    }

    private suspend fun getInfo(id: Int): JSONObject = withContext(IO) {
        val url = URL(BASE_URL.format(id))
        val env = System.getenv()

        val connection = (url.openConnection() as HttpsURLConnection).apply {
            setAuthenticator(object : Authenticator() {
                override fun getPasswordAuthentication(): PasswordAuthentication {
                    return PasswordAuthentication(env[ENV_RSI_USER], env[ENV_RSI_PWD]?.toCharArray())
                }
            })
        }

        val sb = StringBuilder()
        try {
            connection.inputStream.use { iStream ->
                val buffer = ByteArray(BUFFER_SIZE)
                var read: Int = iStream.read(buffer, 0, BUFFER_SIZE)
                while (read > 0) {
                    sb.append(String(buffer, 0, read, Charsets.UTF_8))
                    read = iStream.read(buffer, 0, BUFFER_SIZE)
                }
            }

            JSONObject(sb.toString())
        } catch (e: IOException) {
            System.err.println("Failed to fetch information about id $id")
            JSONObject()
        } catch (e: JSONException) {
            System.err.println("Invalid JSON response for id $id")
            System.err.println(sb.toString())
            JSONObject()
        }
    }
}