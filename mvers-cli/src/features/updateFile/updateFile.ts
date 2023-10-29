import chalk from 'chalk'

import { setGlobalRoot } from '../../helpers/utils.js'
import { build } from '../builder/build.js'
import { getComponent } from '../db/getComponent.js'
import { getVersionNumber } from '../db/getVersionNumber.js'
import { checkIfExists } from './checkIfExists.js'
import { generateVersion } from './generateVersion.js'
import { getExistingVersion } from './getExistingVersion.js'
import { updateImports } from './updateImports.js'

export const updateFiles = (
    root: string,
    componentFullName: string,
    searchWhere: string,
    version: string,
    overwrite = false
) => {
    setGlobalRoot(root)

    // get the component
    const foundComponent = getComponent(componentFullName, searchWhere)

    if (!foundComponent) {
        console.log(
            chalk.red(
                `ERROR: "getComponent has returned empty results. therefore it'is impossible to continue the process.`
            )
        )
        return
    }
    const requestedVersion = getVersionNumber(foundComponent.fullName, version)

    if (!requestedVersion) {
        console.log(
            chalk.red(
                `ERROR: "getVersionNumber has returned empty results. therefore it'is impossible to continue the process.`
            )
        )
        return
    }

    const outputData = getExistingVersion(foundComponent)

    if (!outputData) {
        console.log(
            chalk.red(
                `ERROR: "getExistingVersion has returned empty results. therefore it'is impossible to continue the process.`
            )
        )
        return
    }

    const outputCounts = checkIfExists(outputData, requestedVersion)
    if (!outputCounts || (outputCounts.countVersions > 0 && !overwrite)) {
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
        outputCounts.countRootFiles,
        overwrite
    )

    build(global.rootDirectory, true)

    const gv = generatedVersion

    const redoExsitingProcess = getExistingVersion(foundComponent)
    if (!redoExsitingProcess) {
        console.log(
            chalk.red(
                `ERROR: "redoExsitingProcess: getExistingVersion has returned empty results. therefore it'is impossible to continue the process.`
            )
        )
        return
    }
    updateImports(
        redoExsitingProcess,
        foundComponent.fullName,
        requestedVersion
    )
}
