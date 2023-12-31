import fs from 'fs'
import InDb from './db.js'
import arrayParser from './arrayParser.js'
import chalk from 'chalk'

const clearVersionsProjectFiles = (root, component, searchWhere, version) => {
    global.rootDirectory = root

    const { buildPath } = arrayParser()

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
