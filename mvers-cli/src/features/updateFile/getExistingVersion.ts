import fs from 'fs'

import { IDependency, IExistingVersion } from '../../models/interop.js'
import { InDb } from '../db/db.js'
import { errMsg } from '../errors/helpers.js'
import { buildPath } from '../helpers/buildPath.js'
import { getRootFolderContents } from './getRootFolderContents.js'
import { getVersionsFolderContents } from './getVersionsFolderContents.js'

/**
 * Gets the existing version
 * @param component IDependency
 * @returns IExistingVersion[] | undefined
 */
export const getExistingVersion = (
    component: IDependency
): IExistingVersion[] | undefined => {
    const existingVersion: IExistingVersion[] = []
    const { versions, flatHierarchies } = InDb()

    const componentRef = versions.find(
        (o) => o.componentFullName === component.fullName
    )

    const componentHierarchiesRef = flatHierarchies.find(
        (o) => o.componentFullName === component.fullName
    )

    if (!componentRef?.dependencies || !componentHierarchiesRef?.dependencies)
        return undefined

    for (const v of componentRef.dependencies) {
        const tmpComponent = componentHierarchiesRef.dependencies.find(
            (o) => o.component?.fullName === v.fullName
        )

        if (!tmpComponent?.component) continue

        const componentBasePath = buildPath(
            tmpComponent.component.filePathFromSrc
        )

        const existingItem = existingVersion.find((o) => {
            return o.fullName === componentBasePath
        })

        if (existingItem) continue

        const componentProjectPath = `${global.rootDirectory}\\${componentBasePath}`

        if (!componentProjectPath) {
            errMsg(
                'getExistingVersion',
                `No file exists in this path: ", ${componentProjectPath}!`
            )
            continue
        }

        const existingVersionsFoldersAndContents =
            getVersionsFolderContents(componentProjectPath)
        const rootFolderContents = getRootFolderContents(componentProjectPath)

        existingVersion.push({
            id: tmpComponent.id,
            fullName: componentBasePath,
            paths: tmpComponent.component?.filePathFromSrc,
            existingVersions: existingVersionsFoldersAndContents,
            rootContents: rootFolderContents,
        })
    }

    const sortedExistingVersion = existingVersion.sort((a, b) => a.id - b.id)

    if (!fs?.existsSync(global.rootDirectory)) {
        errMsg(
            'getExistingVersion',
            `ERROR: ", ${global.rootDirectory} does not exists please follow the usage instructions by typing mvr in the command line`
        )
        return []
    }

    const outputFileName = `${global.rootDirectory}\\versions\\${component.file.name}.json`
    if (fs?.existsSync(outputFileName)) {
        try {
            fs?.unlinkSync(outputFileName)
        } catch (e: any) {
            errMsg('getExistingVersion', `ERROR: ", ${e.message}!`)
            return []
        }
    }

    fs.writeFileSync(
        outputFileName,
        JSON.stringify(sortedExistingVersion, null, 2)
    )

    return sortedExistingVersion
}
