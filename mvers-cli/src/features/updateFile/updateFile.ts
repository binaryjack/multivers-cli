import { setGlobalRoot } from '../../helpers/utils.js'
import { loopProjectFiles } from '../builder/loopProjectFiles.js'
import { getComponent } from '../db/getComponent.js'
import { getVersionNumber } from '../db/getVersionNumber.js'
import { dependenciesUpdater } from '../dependenciesParser/dependenciesUpdater.js'
import { importsUpdater } from '../dependenciesParser/importsUpdater.js'
import { errMsg, infoMsg, warnMsg } from '../errors/helpers.js'
import { checkIfExists } from './checkIfExists.js'
import { generateVersion } from './generateVersion.js'
import { getExistingVersion } from './getExistingVersion.js'

/**
 * Will create the versioned files and update all dependency files and imports
 * @param root string
 * @param componentFullName string
 * @param searchWhere string
 * @param version string
 * @param overwrite boolean
 * @returns void
 */
export const updateFiles = (
    root: string,
    componentFullName: string,
    searchWhere: string,
    version: string,
    overwrite = false
) => {
    setGlobalRoot(root)
    // ================== PREPARE  =============================

    // ================== GET COMPONENT =============================
    const foundComponent = getComponent(componentFullName, searchWhere)
    if (!foundComponent) return

    // ================== GET VERSION NUMBER =============================
    const requestedVersion = getVersionNumber(foundComponent.fullName, version)
    if (!requestedVersion) return

    // ================== GET EXISTING VERSION  =============================
    const outputData = getExistingVersion(foundComponent)
    if (!outputData) return

    // ================== CHECK IF VERSION FILES EXISTS  =============================
    const outputCounts = checkIfExists(outputData, requestedVersion)
    if (!outputCounts || (outputCounts.countVersions > 0 && !overwrite)) {
        errMsg(
            'updateFiles',
            `ERROR: ", the versions files already exists. By default you cannot overwrite them, if you want to force the process you can add the -overwite parameter`
        )

        return
    }
    if (outputCounts.countRootFiles === 0) {
        warnMsg(
            'updateFiles',
            `WARNING: ", there is no files in the target directories `
        )
        return
    }
    // ================== OPPS  =============================

    // ================== GENERATE VERSION =============================
    generateVersion(
        outputData,
        requestedVersion,
        outputCounts.countRootFiles,
        overwrite
    )

    // ================== BUILD the dependency file  =============================
    loopProjectFiles(global.rootDirectory, true)
    // update the dependency file with the new file version
    dependenciesUpdater()
    // update imports
    importsUpdater()

    infoMsg(
        'Updating files',
        `Process Complete: you'll find the new versions under */[ComponentFolder]/V${requestedVersion}/[ComponentName].tsx `
    )
}
