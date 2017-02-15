package com.atomist.rug.kind.language_extension

import com.atomist.rug.kind.core.{FileMutableView, ProjectMutableView}
import com.atomist.rug.kind.dynamic.ChildResolver
import com.atomist.rug.runtime.rugdsl.{DefaultEvaluator, Evaluator}
import com.atomist.rug.spi.{ReflectivelyTypedType, Type}
import com.atomist.tree.TreeNode

object LanguageExtensionType {
  val languageExtensionExt = ".language_file_ext"
}

class LanguageExtensionType(evaluator: Evaluator)
  extends Type(evaluator)
    with ChildResolver
    with ReflectivelyTypedType {

  import LanguageExtensionType._

  def this() = this(DefaultEvaluator)

  override def description = "Rug language extension for LanguageExtension"

  override def runtimeClass = classOf[LanguageExtensionMutableView]

  override def findAllIn(context: TreeNode): Option[Seq[TreeNode]] = context match {
      case pmv: ProjectMutableView =>
        Some(pmv.currentBackingObject.allFiles
          .filter(f => f.name.endsWith(languageExtensionExt))
          .map(f => new LanguageExtensionMutableView(f, pmv, new LanguageExtension))
        )
      case fmv: FileMutableView if fmv.name.endsWith(languageExtensionExt) =>
        Some(Seq(new LanguageExtensionMutableView(fmv.currentBackingObject, fmv.parent, new LanguageExtension)))
      case _ => None
    }
}
