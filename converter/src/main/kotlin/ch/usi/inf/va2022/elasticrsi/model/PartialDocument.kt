package ch.usi.inf.va2022.elasticrsi.model

import java.time.LocalDate
import java.time.LocalTime

data class PartialDocument(
    // Temporal information
    val date: LocalDate,
    val time: LocalTime,
    // Geospatial information
    val location: GeoPoint,
    // Request information
    val maskedIp: Keyword,
    val reqType: Keyword,
    val path: String,
    val httpVersion: String,
    val deviceInfo: String,
)
