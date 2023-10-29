import fs from 'fs'

import { buildPath } from '../arrayParsers/buildPath.js'
import InDb from '../db/index.js'
import { errMsg } from '../errors/helpers.js'
import { ProgressBar } from '../progress/progress.js'

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

    const pbar = new ProgressBar(25, componentRef.dependencies.length)

    for (const v of componentRef.dependencies) {
        pbar.increment(`clearVersion - current file: ${v.fullName}`)
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
                errMsg('clearVersion', `ERROR: ", ${e.message}!`)
                return []
            }
        }
    }
}
