plugins {
    id("it.nicolasfarabegoli.conventional-commits") version "3.1.3"
    id("com.github.node-gradle.node") version "7.0.0"
}

node {
    version.set("18.16.0")
    download.set(true)
}

tasks.register<com.github.gradle.node.npm.task.NpxTask>("zcli") {
    group = "zendesk"
    description = "Runs the Zendesk CLI (zcli). Usage: ./gradlew zcli -Pzargs='apps:validate'"
    command.set("zcli")
    workingDir.set(project.projectDir)
    if (project.hasProperty("zargs")) {
        args.set(project.property("zargs").toString().split(" "))
    }
}

subprojects {
    apply(plugin = "com.github.node-gradle.node")

    configure<com.github.gradle.node.NodeExtension> {
        version.set("18.16.0")
        download.set(true)
    }

    tasks.register<Zip>("packagePlugin") {
        group = "packaging"
        description = "Packages the plugin assets into a zip file."

        from("assets")
        archiveFileName.set("${project.name}.zip")
        destinationDirectory.set(layout.buildDirectory.dir("distributions"))
    }

    tasks.register<com.github.gradle.node.npm.task.NpxTask>("validatePlugin") {
        group = "zendesk"
        description = "Validates the plugin using zcli."
        command.set("zcli")
        args.set(listOf("apps:validate", "."))
        workingDir.set(project.projectDir)
    }

    tasks.register<com.github.gradle.node.npm.task.NpxTask>("lint") {
        group = "verification"
        description = "Runs ESLint on JavaScript and JSX files."
        command.set("eslint")
        args.set(listOf("assets", "components", "--fix"))
        workingDir.set(project.projectDir)
    }

    tasks.register<com.github.gradle.node.npm.task.NpxTask>("format") {
        group = "formatting"
        description = "Formats code with Prettier."
        command.set("prettier")
        args.set(listOf("--write", "assets", "components"))
        workingDir.set(project.projectDir)
    }
}
