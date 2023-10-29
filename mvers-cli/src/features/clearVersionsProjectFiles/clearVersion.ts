import chalk from 'chalk'
import fs from 'fs'

import { buildPath } from '../arrayParsers/buildPath.js'
import InDb from '../db/index.js'

export const clearVersion = (componentName: string, version: number) => {
    const { versions, flatHierarchies } = InDb()

    const componentRef = versions.find(
        (o) => o.componentFullName === componentName
    )

    const componentHierarchiesRef = flatHierarchies.find(
        (o) => o.componentFullName === componentName
    )

    if (!componentRef || !componentHierarchiesRef) return

    const versionFolderName = `V${version}`

    for (const v of componentRef.dependencies) {
        const tmpComponent = componentHierarchiesRef.dependencies.find(
            (o) => o.component?.fullName === v.fullName
        )

        if (!tmpComponent?.component) continue

        const componentBasePath = buildPath(
            tmpComponent.component.filePathFromSrc
        )

        const versionFolder = `${global.rootDirectory}\\${componentBasePath}\\${versionFolderName}`
        if (fs?.existsSync(versionFolder)) {
            try {
                fs?.rmSync(versionFolder, { recursive: true, force: true })
            } catch (e: any) {
                console.log(chalk.red(`ERROR: ", ${e.message}!`))
                return []
            }
        }
    }
}
