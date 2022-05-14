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
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.1")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.13.2.2")
    implementation("info.picocli:picocli:4.6.3")
}