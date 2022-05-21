package ch.usi.inf.va2022.elasticrsi.model

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
    val deviceInfo: String,
    // Topics
    val topics: List<String>,
)
