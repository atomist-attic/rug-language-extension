package com.atomist.rug.kind.language_extension

import com.atomist.rug.runtime.rugdsl.DefaultEvaluator
import org.scalatest.{FlatSpec, Matchers}

class LanguageExtensionTypeTest extends FlatSpec with Matchers {

  import LanguageExtensionMutableViewTest._

  val typo = new LanguageExtensionType(DefaultEvaluator)

  it should "be able to find the language in the project" in {
    val mvs = typo.findAllIn(pmv) match {
      case Some(tns) => tns
      case _ => fail(s"failed to find any LanguageExtension in project")
    }
    assert(mvs.size === 1)
    assert(mvs.head.nodeName === "LanguageExtension")
  }

  it should "be able to find the language in the file" in {
    val mvs = typo.findAllIn(fmv) match {
      case Some(tns) => tns
      case _ => fail(s"failed to extract LanguageExtension from file")
    }
    assert(mvs.size === 1)
    assert(mvs.head.nodeName === "LanguageExtension")
  }
}
