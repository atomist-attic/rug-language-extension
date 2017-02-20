# Atomist 'rug-language-extension'

[![Build Status](https://travis-ci.org/atomist-rugs/rug-language-extension.svg?branch=master)](https://travis-ci.org/atomist-rugs/rug-language-extension)
[![Slack Status](https://join.atomist.com/badge.svg)](https://join.atomist.com)

Rug language extension generator.

## Rugs

### NewRugLanguageExtensionProject

The NewRugLanguageExtensionProject generator creates a new Rug
language extension project.

#### Prerequisites

There are no prerequisites to running this generator.

#### Parameters

To run this generator, you must supply the following parameters.

Name | Required | Default | Description
-----|----------|---------|------------
`project_name` | Yes | |  Valid GitHub repository name consisting of alphanumeric, ., -, and _ characters"
`extension_name` | Yes | | [UpperCamelCase][ucc] name of the Rug language extension, usually the name of the language, e.g., "Scala"
`description` | Yes | | A brief description of the project
`extension_file_ext` | Yes | | The file extension, including any leading period, used to identify language files, e.g. ".scala"
`owner` | Yes | | The GitHub repository owner, i.e., group or user owning the repository
`root_package` | Yes | | The root Scala package for your team, e.g., "com.mycompany.myteam"
`version` | No | 0.1.0-SNAPSHOT | [Semantic version][semver] of the project.

[ucc]: http://wiki.c2.com/?UpperCamelCase
[semver]: http://semver.org

#### Running

Run it as follows:

```
$ cd parent/directory
$ rug generate atomist-rugs:rug-language-extension:NewRugLanguageExtensionProject \
    rust-extension \
    extension_name=Rust \
    description="Rug language extension for Rust." \
    extension_file_ext=.rs \
    owner=rusty \
    root_package=org.rust_lang \
    version=0.1.0-SNAPSHOT
```

Note the first parameter, the `project_name`, is different in that you
do not need to supply the name of the parameter, just the value.  This
is because the `project_name` parameter is required for all
generators.  This will create a directory named `rust-extension` and
populate it with a working Rug language extension project.

See the README in the generated project for further instructions.

## Using

To gain access to this language extension in your Rug Archive, add to
`.atomist/manifest.yml`:

```
extensions:
- 'com.atomist:rug-language-extension:M.N.P'
```

Where `M.N.P` is a released version (see below) of the language
extension.

## Developing

To build and test this project:

```
$ ./mvnw test
```

### Updating rug dependency

To update the rug dependency, change `rug.version` in the pom.xml.

### Releasing

To create a new release of the project, simply push a tag of the form
`M.N.P` where `M`, `N`, and `P` are integers that form the next
appropriate [semantic version][semver] for release.  For example:

```sh
$ git tag -a 1.2.3
```

The Travis CI build (see badge at the top of this page) will
automatically create a GitHub release using the tag name for the
release and the comment provided on the annotated tag as the contents
of the release notes.  It will also automatically upload the needed
artifacts.

[semver]: http://semver.org
