package ch.usi.inf.va2022.elasticrsi.model

import io.github.mngsk.devicedetector.Detection

data class Document(
    // Temporal information
    val dateTime: String,
    val dayOfWeek: Int,
    val timezone: Float,
    // Geospatial information
    val location: GeoPoint,
    val continent: Keyword,
    val country: Keyword,
    val admin1: Keyword,
    // Request information
    val maskedIp: Keyword,
    val reqType: Keyword,
    val path: String,
    val httpVersion: String,
    val userAgent: Detection,
    // Topics
    val topics: List<String>,
)
