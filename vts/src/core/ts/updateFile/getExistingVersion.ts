import chalk from 'chalk';
import fs from 'fs';
import { versions } from 'process';

import { buildPath } from '../arrayParsers/buildPath.js';
import { InDb } from '../db/db.js';
import { getRootFolderContents } from './getRootFolderContents.js';
import { getVersionsFolderContents } from './getVersionsFolderContents.js';

export const getExistingVersion = (componentName: string) => {
    const existingVersion = []

    const { versions, flatHierarchies } = InDb()

    const componentRef = versions.find(
        (o) => o.componentFullName === componentName
    )

    const componentHierarchiesRef = flatHierarchies.find(
        (o) => o.componentFullName === componentName
    )

    if (!componentRef?.dependencies || !componentHierarchiesRef?.dependencies)
        return

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
            console.log('not exists ')
            continue
        }

        const existingVersionsFoldersAndContents =
            getVersionsFolderContents(componentProjectPath)
        const rootFolderContents = getRootFolderContents(componentProjectPath)

        existingVersion.push({
            id: tmpComponent.id,
            fullName: componentBasePath,
            paths: tmpComponent.filePathFromSrc,
            existingVersions: existingVersionsFoldersAndContents,
            rootContents: rootFolderContents,
        })
    }

    const sortedExistingVersion = existingVersion.sort((a, b) => a.id - b.id)

    if (!fs?.existsSync(directoryName)) {
        console.log(
            chalk.red(
                `ERROR: ", ${directoryName} does not exists please follow the usage instructions by typing mvers in the command line!`
            )
        )
        return []
    }

    const outputFileName = `${directoryName}\\versions\\${foundComponent.file.name}.json`
    if (fs?.existsSync(outputFileName)) {
        try {
            fs?.unlinkSync(outputFileName)
        } catch (e) {
            console.log(chalk.red(`ERROR: ", ${e.message}!`))
            return []
        }
    }

    fs.writeFileSync(
        outputFileName,
        JSON.stringify(sortedExistingVersion, null, 2)
    )

    return sortedExistingVersion
}
