package com.atomist.rug.kind.language_extension

import com.atomist.rug.kind.core.{LazyFileArtifactBackedMutableView, ProjectMutableView}
import com.atomist.rug.spi.{ExportFunction, ExportFunctionParameterDescription}
import com.atomist.source.FileArtifact

object LanguageExtensionMutableView {

  val useful: String = "not really useful"

}

class LanguageExtensionMutableView(
                                    originalBackingObject: FileArtifact,
                                    parent: ProjectMutableView,
                                    languageExtension: LanguageExtension
                                  )
  extends LazyFileArtifactBackedMutableView(originalBackingObject, parent) {

  import LanguageExtensionMutableView._

  override def nodeName = "LanguageExtension"

  // Typically you will parse the contents of the original backing object into
  // some useful form
  private val originalContent = originalBackingObject.content
  private var _currentContent = originalContent

  override protected def currentContent: String = _currentContent

  @ExportFunction(readOnly = true, description = "Returns something useful")
  def somethingUseful: String = useful

  @ExportFunction(readOnly = true, description = "Returns something useful")
  def contents: String = currentContent

  @ExportFunction(readOnly = false, description = "Set contents of LanguageExtension file to `content`")
  def setContents(
                   @ExportFunctionParameterDescription(name = "content", description = "New contents for file") content: String
                 ): Unit = _currentContent = content

}
