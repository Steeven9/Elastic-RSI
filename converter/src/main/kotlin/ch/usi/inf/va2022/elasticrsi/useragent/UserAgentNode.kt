package ch.usi.inf.va2022.elasticrsi.useragent

sealed interface UserAgentNode {

    @JvmInline
    value class UserAgent(val programs: List<Program>) : UserAgentNode

    data class Program(val product: Product, val comment: Comment?) : UserAgentNode

    data class Product(val name: Name, val version: Version) : UserAgentNode

    @JvmInline
    value class Name(val name: String) : UserAgentNode

    @JvmInline
    value class Version(val segment: List<String>) : UserAgentNode

    @JvmInline
    value class Comment(val details: List<Detail>) : UserAgentNode

    @JvmInline
    value class Detail(val detail: String) : UserAgentNode
}