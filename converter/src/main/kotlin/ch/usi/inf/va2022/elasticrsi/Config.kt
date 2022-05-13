package ch.usi.inf.va2022.elasticrsi

import java.time.format.DateTimeFormatter

object Config {

    object Output {
        const val CHANNEL_SIZE = 2048
        const val ENTRIES_PER_FILE = 1024
        const val BASE_PATH = "%s.%03d.part"
        const val DEFAULT_BASE_FILE_NAME = "output.ndjson"
    }

    object Parser {
        val DATE_FORMAT: DateTimeFormatter = DateTimeFormatter.ISO_LOCAL_DATE
        val TIME_FORMAT: DateTimeFormatter = DateTimeFormatter.ISO_LOCAL_TIME
    }
}
