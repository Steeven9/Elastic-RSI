package ch.usi.inf.va2022.elasticrsi.useragent

class UserAgentParser : (String) -> UserAgentNode.UserAgent? {
    private var i: Int = 0
    private var ua: String = ""

    override fun invoke(p1: String): UserAgentNode.UserAgent? {
        return try {
            ua = p1
            userAgent()
        } catch (e: Exception) {
            null
        }
    }

    private fun userAgent(): UserAgentNode.UserAgent {
        val programs = ArrayList<UserAgentNode.Program>()
        while (i < ua.length) {
            whiteSpace()
            programs.add(program())
            whiteSpace()
        }
        return UserAgentNode.UserAgent(programs)
    }

    private fun program(): UserAgentNode.Program {
        val product = product()
        whiteSpace()
        val comment = if (isCurrentChar('(')) comment() else null
        whiteSpace()
        return UserAgentNode.Program(product, comment)
    }

    private fun product(): UserAgentNode.Product {
        val name = name()
        whiteSpace()
        consume('/')
        whiteSpace()
        val version = version()
        return UserAgentNode.Product(name, version)
    }

    private fun comment(): UserAgentNode.Comment {
        val details = ArrayList<UserAgentNode.Detail>()
        consume('(')
        whiteSpace()
        details.add(detail())
        while (isCurrentChar(';', ',')) {
            consume(';', ',')
            whiteSpace()
            details.add(detail())
            whiteSpace()
        }
        consume(')')
        return UserAgentNode.Comment(details)
    }

    private fun name(): UserAgentNode.Name {
        val name = StringBuilder()
        while (thereIsMore() && !isCurrentChar( '/', '\r', '\n')) {
            name.append(next())
        }
        return UserAgentNode.Name(name.toString().trim())
    }

    private fun version(): UserAgentNode.Version {
        val segments = ArrayList<String>()
        segments.add(versionSegment())
        while (isCurrentChar('.')) {
            consume('.')
            segments.add(versionSegment())
        }
        return UserAgentNode.Version(segments)
    }

    private fun versionSegment(): String {
        val segment = StringBuilder()
        while (isCurrentChar('a'..'z', 'A'..'Z', '0'..'9') || isCurrentChar('-')) {
            segment.append(next())
        }
        return segment.toString()
    }

    private fun detail(): UserAgentNode.Detail {
        val detail = StringBuilder()
        while (thereIsMore() && !isCurrentChar(';', ',', ')')
        ) {
            detail.append(next())
        }
        return UserAgentNode.Detail(detail.toString().trim())
    }

    private fun whiteSpace() {
        while (i < ua.length && (ua[i] == ' ' || ua[i] == '\r' || ua[i] == '\n')) {
            i++
        }
    }

    private fun isCurrentChar(vararg anyChar: Char): Boolean =
        i < ua.length && ua[i] in anyChar

    private fun isCurrentChar(vararg orRanges: CharRange): Boolean =
        i < ua.length && orRanges.any { ua[i] in it }

    private fun consume(vararg anyChar: Char) {
        assert(ua[i++] in anyChar) {
            "Expected any of [${anyChar.joinToString(", ")}], but got '${ua[i - 1]}' ($ua @ ${i - 1})"
        }
    }

    private fun next(): Char =
        ua[i++]

    private fun thereIsMore(): Boolean =
        i < ua.length
}