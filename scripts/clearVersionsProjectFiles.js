import fs from 'fs'
import InDb from './db.js'
import stringParsers from './stringParsers.js'
import fileManager from './fileManager.js'
import settings from './settings.js'
import arrayParser from './arrayParser.js'
import chalk from 'chalk'
import cliProgress from 'cli-progress'
import dependencyBuilder from './dependencyBuilder.js'
import { save } from 'npm/lib/utils/metrics.js'

const clearVersionsProjectFiles = (root, component, searchWhere, version) => {
    global.rootDirectory = root
    const { statingNewVersionFrom } = settings()
    const { replaceAll } = stringParsers()
    const { directoryName } = fileManager()
    const { buildVersionPath, buildPath } = arrayParser()

    const { flatHierarchies, getComponent, versions, getVersionNumber } = InDb()
    // get the component
    const foundComponent = getComponent(component, searchWhere)
    if (!foundComponent) return

    const requestedVersion = getVersionNumber(foundComponent.fullName, version)

    const clearVersion = (component, version) => {
        const componentRef = versions.find(
            (o) => o.componentFullName === component
        )

        const componentHierarchiesRef = flatHierarchies.find(
            (o) => o.componentFullName === component
        )

        const versionFolderName = `V${version}`

        for (const v of componentRef.dependencies) {
            const tmpComponent = componentHierarchiesRef.dependencies.find(
                (o) => o.component.fullName === v.fullName
            )

            if (!tmpComponent) continue

            const componentBasePath = buildPath(
                tmpComponent.component.filePathFromSrc
            )

            const versionFolder = `${global.rootDirectory}\\${componentBasePath}\\${versionFolderName}`
            if (fs?.existsSync(versionFolder)) {
                try {
                    fs?.rmSync(versionFolder, { recursive: true, force: true })
                } catch (e) {
                    console.log(chalk.red(`ERROR: ", ${e.message}!`))
                    return []
                }
            }
        }
    }

    clearVersion(foundComponent.fullName, requestedVersion)
}

export default clearVersionsProjectFiles
