@file:JvmName("DocumentUtils")

package ch.usi.inf.va2022.elasticrsi

import ch.usi.inf.va2022.elasticrsi.model.Document
import ch.usi.inf.va2022.elasticrsi.model.GeoPoint
import ch.usi.inf.va2022.elasticrsi.model.PartialDocument
import io.github.mngsk.devicedetector.Detection
import io.github.mngsk.devicedetector.DeviceDetector
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.iakovlev.timeshape.TimeZoneEngine
import uk.recurse.geocoding.reverse.ReverseGeocoder
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import java.time.ZoneOffset

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

suspend fun PartialDocument.augment(
    geocoder: ReverseGeocoder,
    deviceDetector: DeviceDetector,
    timeZoneEngine: TimeZoneEngine,
): Document = withContext(Dispatchers.Default) {
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
    val topics = RsiTopicUtil.buildTopicsFromPath(path)
    val userAgent = deviceDetector.parseDeviceInfo(deviceInfo)

    val localDateTime = timeZoneEngine.query(location.lat.toDouble(), location.lon.toDouble())
        .map {
            date.atTime(time)
                .atZone(ZoneId.of("Europe/Amsterdam"))
                .withZoneSameInstant(it)
        }
        .map {
            Config.Parser.DATE_FORMAT.format(it.toLocalDate()) +
                    " " +
                    Config.Parser.TIME_FORMAT.format(it.toLocalTime())
        }
        .orElse("unknown")

    Document(
        dateTime = dateTime,
        localDateTime = localDateTime,
        dayOfWeek = date.dayOfWeek.value,
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
            "\"ch_date\": \"$dateTime\", " +
            "\"local_date\": \"$localDateTime\", " +
            "\"day_of_week\": \"$dayOfWeek\", " +
            "\"location\": {\"lat\": \"${location.lat}\", \"lon\": \"${location.lon}\"}, " +
            "\"continent\": \"$continent\", " +
            "\"country\": \"$country\", " +
            "\"admin1\": \"$admin1\", " +
            "\"masked_ip\": \"$maskedIp\", " +
            "\"req_type\": \"$reqType\", " +
            "\"path\": \"$path\", " +
            "\"http_version\": \"$httpVersion\", " +
            "\"user_agent\": $userAgent, " +
            "\"topics\": [\"${topics.joinToString("\", \"")}\"] " +
            "}\n"
}

private fun DeviceDetector.parseDeviceInfo(deviceInfo: String): String {
    return if (deviceInfo == "Intlayer-SrfHttpClient") {
        // Keep intlayer-srfhttpclient as-is
        "[\"Intlayer-SrfHttpClient\"]"
    } else {
        detect(deviceInfo).keywords()
    }
}

private fun Detection.keywords(): String {
    val keywords = HashSet<String>()
    client?.ifPresent { client ->
        client.name.ifPresent { name -> keywords.add(name) }
        keywords.add(client.type)
    }
    device?.ifPresent { device ->
        device.brand.ifPresent { brand -> keywords.add(brand) }
        device.model.ifPresent { model -> keywords.add(model) }
        keywords.add(device.type)
    }
    operatingSystem.ifPresent { os ->
        os.family.ifPresent { family -> keywords.add(family) }
        os.platform.ifPresent { platform -> keywords.add(platform) }
        keywords.add(os.name)
    }
    return "[\"${keywords.joinToString("\", \"")}\"]"
}
