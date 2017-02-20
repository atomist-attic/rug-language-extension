/*
 * Copyright © 2017 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { PopulateProject } from '@atomist/rug/operations/ProjectGenerator';
import { Project, File, Pom } from '@atomist/rug/model/Core';
import { Generator, Parameter, Tags } from '@atomist/rug/operations/Decorators';
import { Pattern } from '@atomist/rug/operations/RugOperation';
import { PathExpression, PathExpressionEngine, TreeNode, Match } from '@atomist/rug/tree/PathExpression'

@Generator("NewRugLanguageExtensionProject", "create a new Scala Rug language extension project")
@Tags("rug", "scala")
class NewRugLanguageExtensionProject implements PopulateProject {

    @Parameter({
        displayName: "Project Name",
        description: "name of project to be created",
        pattern: Pattern.project_name,
        validInput: "a valid GitHub project name consisting of alphanumeric, ., -, and _ characters",
        minLength: 1,
        maxLength: 100
    })
    project_name: string;

    @Parameter({
        displayName: "Extension Name",
        description: "name of the Rug language extension, usually the name of the language",
        pattern: "^[A-Z][A-Za-z0-9]*$",
        validInput: "a CamelCase string starting with a capital letter and containing only alphanumeric characters",
        minLength: 1,
        maxLength: 100
    })
    extension_name: string;

    @Parameter({
        displayName: "Extension Description",
        description: "description of the Rug language extension",
        pattern: Pattern.any,
        validInput: "a string between one and 100 characters",
        minLength: 1,
        maxLength: 100
    })
    description: string;

    @Parameter({
        displayName: "Language File Extension",
        description: "languge file extension, including any leading period, e.g., `.f77`",
        pattern: Pattern.project_name,
        validInput: "a string containing alphanumeric, ., -, and _ characters",
        minLength: 1,
        maxLength: 100
    })
    extension_file_ext: string;

    @Parameter({
        displayName: "GitHub Repo Owner",
        description: "Owner, i.e., org or user, of the GitHub repository for this project",
        pattern: Pattern.project_name,
        validInput: "a valid GitHub owner name containing alphanumeric, ., -, and _ characters",
        minLength: 1,
        maxLength: 100
    })
    owner: string;

    @Parameter({
        displayName: "Root Package",
        description: "root package for your generated source, e.g., `com.mycompany.myteam`",
        pattern: Pattern.java_package,
        validInput: "a valid Java package name, which consists of period-separated identifiers which have only alphanumeric characters, $ and _ and do not start with a number",
        minLength: 1,
        maxLength: 100
    })
    root_package: string;

    @Parameter({
        displayName: "Version",
        description: "initial version of the project, e.g., 1.2.3-SNAPSHOT",
        pattern: Pattern.semantic_version,
        validInput: "a valid semantic version, http://semver.org",
        required: false,
        minLength: 1,
        maxLength: 100
    })
    version: string = "0.1.0-SNAPSHOT";

    populate(project: Project) {
        project.deleteFile(".atomist.yml");
        project.deleteFile("CODE_OF_CONDUCT.md");

        for (let f of project.files()) {
            let oldPath = f.path()
            let newPath = this.convertPath(oldPath);
            if (newPath != oldPath) {
                project.copyEditorBackingFileOrFail(oldPath, newPath);
                project.deleteFile(oldPath);
            }
        }

        project.replace("rug-language-extension", this.project_name);
        project.replace("LanguageExtension", this.extension_name);
        project.replace("language_extension", this.snakeExtensionName());
        project.replace(".language_file_ext", this.extension_file_ext);
        project.replace("atomist-rugs", this.owner);
        project.replace("com.atomist", this.root_package);
        project.replace("Rug language extension generator.", this.description);

        let eng: PathExpressionEngine = project.context().pathExpressionEngine();

        let readmePathExpression = new PathExpression<Project, File>("/*[@name='README.md']");
        let readmeFile: File = eng.scalar(project, readmePathExpression);
        readmeFile.regexpReplace("## Rugs[\\s\\S]*## Using", "## Using");

        let changeLogPathExpression = new PathExpression<Project, File>("/*[@name='CHANGELOG.md']");
        let changeLogFile: File = eng.scalar(project, changeLogPathExpression);
        changeLogFile.regexpReplace("HEAD[\\S\\s]*## \\[0.1.0\\]", "HEAD\n\n## [0.1.0]");

        let pomPathExpression = new PathExpression<Project, Pom>("/Pom()");
        let pom: Pom = eng.scalar(project, pomPathExpression);
        pom.setVersion(this.version);
        // undo replace of com.atomst in rug dependency groupId
        let rugVersion: string = pom.dependencyVersion(this.root_package, "rug");
        pom.removeDependency(this.root_package, "rug");
        pom.addOrReplaceDependency("com.atomist", "rug");
        pom.addOrReplaceDependencyVersion("com.atomist", "rug", rugVersion);
    }

    private snakeExtensionName(): string {
        return this.extension_name.replace(/\B[A-Z]/g, "_$1").toLowerCase();
    }

    private rootPackagePath(): string {
        return this.root_package.replace(/\./g, "/");
    }

    private convertPath(oldPath: string): string {
        return oldPath.replace("com/atomist", this.rootPackagePath())
            .replace("language_extension", this.snakeExtensionName())
            .replace("LanguageExtension", this.extension_name);
    }
}

export let newRugLanguageExtensionProject = new NewRugLanguageExtensionProject();
