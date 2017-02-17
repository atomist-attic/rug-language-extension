package com.atomist.rug.kind.language_extension

import org.scalatest.{FlatSpec, Matchers}

class LanguageExtensionTest extends FlatSpec with Matchers {

  it should "get it" in {
    assert(LanguageExtension().it === "it")
  }
}
