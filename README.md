# Atomist 'rug-language-extension'

[![Build Status](https://travis-ci.org/atomist-rugs/rug-language-extension.svg?branch=master)](https://travis-ci.org/atomist-rugs/rug-language-extension)
[![Slack Status](https://join.atomist.com/badge.svg)](https://join.atomist.com)

Rug language extension generator.

## Using

To gain access to this language extension in your Rug Archive, add to
`.atomist/manifest.yml`:

```
extensions:
- 'com.atomist:rug-language-extension:0.1.0'
```

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
