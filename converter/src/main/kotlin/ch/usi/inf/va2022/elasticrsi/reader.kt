@file:JvmName("ReaderUtils")

package ch.usi.inf.va2022.elasticrsi.io

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Dispatchers.IO
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.withContext
import java.io.BufferedReader
import java.io.InputStreamReader
import java.nio.file.Files
import java.nio.file.Path

/**
 * Read all file lines asynchronously
 */
suspend fun readLinesAsync(path: Path, block: suspend (String) -> Unit) {
    withContext(IO) {
        val reader = BufferedReader(InputStreamReader(Files.newInputStream(path)))
        val linesSequence = reader.lineSequence()
        val tasks = linesSequence.map { line ->
            async(Dispatchers.Default) { block(line) }
        }.toList()
        tasks.awaitAll()
        reader.close()
    }
}


