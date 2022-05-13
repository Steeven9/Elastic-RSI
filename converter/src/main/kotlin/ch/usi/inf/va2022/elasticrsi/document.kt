@file:JvmName("DocumentUtils")

package ch.usi.inf.va2022.elasticrsi

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ch.usi.inf.va2022.elasticrsi.model.Document
import ch.usi.inf.va2022.elasticrsi.model.GeoPoint
import ch.usi.inf.va2022.elasticrsi.model.PartialDocument
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
    val deviceInfo = entries.drop(7).joinToString(" ")

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
    val country = withContext(Dispatchers.IO) { geocoder.getCountry(location.lat, location.lon) }
    val countryName = country.map { it.iso() }.orElse("unknown")
    val timeZone = country.flatMap { geocoder.getTimezone(it) }
        .map { it.gmtOffset() }
        .orElse(0f)

    Document(
        dateTime = dateTime,
        dayOfWeek = date.dayOfWeek.value,
        timezone = timeZone,
        location = location,
        country = countryName,
        maskedIp = maskedIp,
        reqType = reqType,
        path = path,
        httpVersion = httpVersion,
        deviceInfo = deviceInfo,
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
            "\"country\": \"$country\", " +
            "\"masked_ip\": \"$maskedIp\", " +
            "\"req_type\": \"$reqType\", " +
            "\"path\": \"$path\", " +
            "\"http_version\": \"$httpVersion\", " +
            "\"device_info\": \"$deviceInfo\" " +
            "}\n"
}
