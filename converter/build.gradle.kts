import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "1.6.21"
    id("com.github.johnrengelman.shadow") version "7.1.2"
    application
}

group = "ch.usi.inf.va2022.elasticrsi"
version = "1.0"

repositories {
    mavenCentral()
}

tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "11"
}

application {
    mainClass.set("ch.usi.inf.va2022.elasticrsi.Main")
}

tasks {
    named<com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar>("shadowJar") {
        archiveBaseName.set("converter")
        mergeServiceFiles()
        manifest {
            attributes(mapOf("Main-Class" to "ch.usi.inf.va2022.elasticrsi.MainKt"))
        }
    }
}

dependencies {
    implementation("com.fasterxml.jackson.core:jackson-databind:2.13.3")
    implementation("info.picocli:picocli:4.6.3")
    implementation("io.github.mngsk:device-detector:1.0.10")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.1")
    implementation("org.json:json:20220320")
    implementation("org.slf4j:slf4j-nop:1.7.36")
    implementation("net.iakovlev:timeshape:2020d.12")
}
