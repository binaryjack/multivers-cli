import fs from 'fs'

import { recursFiles } from '../builder/recursFile.js'
import { InDb } from '../db/db.js'
import { errMsg } from '../errors/helpers.js'
import { buildPath } from '../helpers/buildPath.js'
import { ProgressBar } from '../progress/progress.js'
import { ask } from '../question/question.js'
import { hasChanges } from './hasChanges.js'

/**
 * Will clear the versioned files and their directories
 * @param componentName string
 * @param version string
 * @returns void
 */
export const clearVersion = async (componentName: string, version: number) => {
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

        const baseFolder = `${global.rootDirectory}\\${componentBasePath}`
        const versionFolder = `${baseFolder}\\${versionFolderName}`
        if (fs?.existsSync(versionFolder)) {
            const files = recursFiles(versionFolder)
            try {
                for (const fileInfo of files) {
                    const originalFile = `${baseFolder}\\${fileInfo.file.name}.${fileInfo.file.extension}`
                    const versionedFile = `${versionFolder}\\${fileInfo.file.name}.${fileInfo.file.extension}`

                    const result = hasChanges(originalFile, versionedFile)
                    if (result) {
                        const answer = await ask(
                            `The file ${versionFolder}\\${fileInfo.file.name}.${fileInfo.file.extension} has been changed, delete it anyways?`
                        )
                        if (!['y', 'Y'].includes(answer)) {
                            return
                        }
                    }
                    fs?.unlinkSync(versionedFile)
                    console.log(originalFile)
                }

                const countRemainingFiles = recursFiles(versionFolder)?.length
                if (countRemainingFiles === 0) {
                    fs?.rmSync(versionFolder, {
                        recursive: true,
                        force: true,
                    })
                }
            } catch (e: any) {
                errMsg('clearVersion', `ERROR: ", ${e.message}!`)
                return []
            }
        }
    }
}
