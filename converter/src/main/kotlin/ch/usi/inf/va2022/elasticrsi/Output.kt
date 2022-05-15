package ch.usi.inf.va2022.elasticrsi

import java.io.Closeable
import java.io.OutputStream
import java.nio.file.Files
import java.nio.file.Path
import java.util.concurrent.atomic.AtomicInteger

/**
 * Write output to multiple .part files with automatic splitting.
 */
class Output(
    private val baseName: String,
    private val entriesPerFile: Int,
) : Closeable {
    private val entriesCounter = AtomicInteger(0)
    private val partCounter = AtomicInteger(0)

    private var outputReference: OutputStream? = null

    init {
        next()
    }

    fun writeEntry(entry: String) {
        outputReference!!.write(entry.toByteArray(Charsets.UTF_8))
        if (entriesCounter.incrementAndGet() >= entriesPerFile) {
            next()
        }
    }

    override fun close() {
        outputReference?.apply {
            flush()
            close()
        }
        outputReference = null
    }

    private fun next() {
        outputReference?.apply {
            flush()
            close()
        }

        val path = Config.Output.BASE_PATH.format(baseName, partCounter.getAndIncrement())
        outputReference = Files.newOutputStream(Path.of(path))
        entriesCounter.set(0)
    }
}
