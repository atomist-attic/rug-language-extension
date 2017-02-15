import {TreeNode} from '@atomist/rug/tree/PathExpression'
import {Services} from '@atomist/rug/model/Core'

export interface LanguageExtension extends TreeNode {

  somethingUseful(): string

  contents(): string

  setContents(newContent: string): void
}
