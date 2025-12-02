# crispy-fishstick
Collection of Zendesk Plugins we use in JustServe

## How to Use

This repository contains Zendesk plugins managed as a Gradle project.

### Prerequisites

- Java 11 or higher (for Gradle)
- No local Node.js installation is required; Gradle manages a sandboxed version.

### Building Plugins

To package all plugins into zip files for deployment:

```bash
./gradlew packagePlugin
```

The generated zip files will be located in each plugin's `build/distributions/` directory.

### Running ZCLI

You can run Zendesk CLI commands without installing it globally:

```bash
./gradlew zcli -Pzargs="apps:validate"
```



### Development

Each plugin is located in its own directory (e.g., `help-center-redirect-manager`). The source code is in the `assets` folder.
