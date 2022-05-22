@file:JvmName("DocumentUtils")

package ch.usi.inf.va2022.elasticrsi

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ch.usi.inf.va2022.elasticrsi.model.Document
import ch.usi.inf.va2022.elasticrsi.model.GeoPoint
import ch.usi.inf.va2022.elasticrsi.model.PartialDocument
import ch.usi.inf.va2022.elasticrsi.useragent.UserAgentNode
import ch.usi.inf.va2022.elasticrsi.useragent.UserAgentParser
import uk.recurse.geocoding.reverse.ReverseGeocoder
import java.time.LocalDate
import java.time.LocalTime

fun parseLogLine(line: String): PartialDocument? {
    val entries = line.split(" ")
    if (entries.size < 9) {
        return null
    }

    val date = LocalDate.parse(entries[0], Config.Parser.DATE_FORMAT)
    val time = LocalTime.parse(entries[1], Config.Parser.TIME_FORMAT)
    val maskedIp = entries[2]
    val location = GeoPoint(
        lat = entries[3].toFloat(),
        lon = entries[4].toFloat(),
    )
    val reqType = entries[5]
    val path = entries[6]
    val httpVersion = entries[7]
    val deviceInfo = entries.drop(8).joinToString(" ")

    return PartialDocument(
        date = date,
        time = time,
        maskedIp = maskedIp,
        location = location,
        reqType = reqType,
        path = path,
        httpVersion = httpVersion,
        deviceInfo = deviceInfo,
    )
}

suspend fun PartialDocument.augment(geocoder: ReverseGeocoder): Document = withContext(Dispatchers.Default) {
    val dateTime = Config.Parser.DATE_FORMAT.format(date) +
            " " +
            Config.Parser.TIME_FORMAT.format(time)
    val country = geocoder.getCountry(location.lat, location.lon)
    val continent = country
        .map { it.continent() }
        .orElse("unknown")
    val countryName = country
        .map { it.iso() }
        .orElse("unknown")
    val admin1 = geocoder.getAdmin1(location.lat, location.lon)
        .map { it.name() }
        .orElse("unknown")
    val timeZone = country.flatMap { geocoder.getTimezone(it) }
        .map { it.gmtOffset() }
        .orElse(0f)
    val topics = RsiTopicUtil.buildTopicsFromPath(path)
    val userAgent = UserAgentParser()(deviceInfo)

    Document(
        dateTime = dateTime,
        dayOfWeek = date.dayOfWeek.value,
        timezone = timeZone,
        location = location,
        admin1 = admin1,
        continent = continent,
        country = countryName,
        maskedIp = maskedIp,
        reqType = reqType,
        path = path,
        httpVersion = httpVersion,
        userAgent = userAgent,
        topics = topics,
    )
}

/**
 * Serialize this document as a ndjson entry for Elasticsearch consumption.
 */
fun Document.toNdjson(): String {
    return "{\"index\": {}}\n{" +
            "\"date\": \"$dateTime\", " +
            "\"day_of_week\": \"$dayOfWeek\", " +
            "\"timezone\": \"$timezone\", " +
            "\"location\": {\"lat\": \"${location.lat}\", \"lon\": \"${location.lon}\"}, " +
            "\"continent\": \"$continent\", " +
            "\"country\": \"$country\", " +
            "\"admin1\": \"$admin1\", " +
            "\"masked_ip\": \"$maskedIp\", " +
            "\"req_type\": \"$reqType\", " +
            "\"path\": \"$path\", " +
            "\"http_version\": \"$httpVersion\", " +
            "\"user_agent\": ${userAgent.keywords()}, " +
            "\"topics\": [\"${topics.joinToString("\", \"")}\"] " +
            "}\n"
}

private fun UserAgentNode.UserAgent?.keywords(): String {
    return '[' +
            (this?.programs?.joinToString(", ") { program ->
                val sb = StringBuilder()
                sb.append("\"${program.product.name.name} ${program.product.version.segment.joinToString(".")}\"")
                if (program.comment != null && program.comment.details.isNotEmpty()) {
                    sb.append(", \"")
                    sb.append(program.comment.details.joinToString("\", \"") { it.detail })
                    sb.append("\"")
                }
                sb.toString()
            } ?: "") +
            ']'
}
