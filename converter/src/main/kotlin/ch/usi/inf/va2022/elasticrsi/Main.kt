package ch.usi.inf.va2022.elasticrsi

import ch.usi.inf.va2022.elasticrsi.io.readLinesAsync
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import picocli.CommandLine
import picocli.CommandLine.Command
import picocli.CommandLine.Option
import picocli.CommandLine.Parameters
import uk.recurse.geocoding.reverse.ReverseGeocoder
import java.nio.file.Path
import java.util.concurrent.Callable
import kotlin.system.exitProcess

@Command(name = "convert")
class Main : Callable<Int> {

    @Parameters(
        index = "0",
        description = ["Output file base name"],
        defaultValue = Config.Output.DEFAULT_BASE_FILE_NAME,
    )
    var outputPath: String = Config.Output.DEFAULT_BASE_FILE_NAME

    @Parameters(
        arity = "1..*",
        index = "1..*",
        description = ["Input files"]
    )
    var inputPaths: Array<Path> = emptyArray()

    @Option(
        names = ["-v", "--verbose"],
    )
    var verbose: Boolean = false

    @Option(
        names = ["-e", "--entries-per-file"],
        defaultValue = Config.Output.ENTRIES_PER_FILE.toString(),
        description = ["Entries per '.part' file"],
    )
    var entriesPerFile = Config.Output.ENTRIES_PER_FILE

    override fun call(): Int = runBlocking {
        val geocoder = ReverseGeocoder()
        Output(outputPath, entriesPerFile).use { output ->
            val chan = Channel<String>(Config.Output.CHANNEL_SIZE)

            launch {
                inputPaths.forEach { path ->
                    if (verbose) println("Reading ${path.fileName}...")

                    readLinesAsync(path) { line ->
                        val partialDocument = parseLogLine(line)
                        if (partialDocument == null) {
                            if (verbose) {
                                System.err.println("Skipping malformed log line in file ${path.fileName}:\t$line")
                            }
                        } else {
                            chan.send(partialDocument.augment(geocoder).toNdjson())
                        }
                    }
                }
                chan.close()
            }

            for (entry in chan) {
                if (verbose) {
                    print("-> $entry")
                }
                output.writeEntry(entry)
            }

            if (verbose) {
                println("Done!")
            }
        }

        0
    }

    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            val exitCode = CommandLine(Main()).execute(*args)
            exitProcess(exitCode)
        }
    }
}
