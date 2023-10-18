import chalk from 'chalk';

import { getComponent } from '../db/getComponent.js';
import { getVersionNumber } from '../db/getVersionNumber.js';
import { checkIfExists } from './checkIfExists.js';
import { generateVersion } from './generateVersion.js';
import { getExistingVersion } from './getExistingVersion.js';
import { updateImports } from './updateImports.js';

export const updateFiles = (
    root: string,
    component: string,
    searchWhere: string,
    version: string,
    overwrite = false
) => {
    global.rootDirectory = root


    // get the component
    const foundComponent = getComponent(component, searchWhere)
    if (!foundComponent) return

    const requestedVersion = getVersionNumber(foundComponent.fullName, version)

    const outputData = getExistingVersion(foundComponent.fullName)

    const outputCounts = checkIfExists(outputData, requestedVersion)
    if (outputCounts.countVersions > 0 && !overwrite) {
        console.log(
            chalk.red(
                `ERROR: ", the versions files already exists. By default you cannot overwrite them, if you want to force the process you can add the -overwite parameter`
            )
        )
        return
    }
    if (outputCounts.countRootFiles === 0) {
        console.log(
            chalk.yellow(
                `WARNING: ", there is no files in the target directories `
            )
        )
        return
    }

    const generatedVersion = generateVersion(
        outputData,
        requestedVersion,
        outputCounts.countRootFiles
    )

    const gv = generatedVersion

    const redoExsitingProcess = getExistingVersion(foundComponent.fullName)

    updateImports(
        redoExsitingProcess,
        foundComponent.fullName,
        requestedVersion
    )
}
