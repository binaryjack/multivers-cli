import { setGlobalRoot } from '../../helpers/utils.js'
import { build } from '../builder/build.js'
import { getComponent } from '../db/getComponent.js'
import { getVersionNumber } from '../db/getVersionNumber.js'
import {
    dependenciesUpdater,
    importsUpdater,
} from '../dependenciesParser/dependenciesParser.js'
import { errMsg, warnMsg } from '../errors/helpers.js'
import { checkIfExists } from './checkIfExists.js'
import { generateVersion } from './generateVersion.js'
import { getExistingVersion } from './getExistingVersion.js'

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
    build(global.rootDirectory, true)
    // update the dependency file with the new file version
    dependenciesUpdater()

    importsUpdater()
}
