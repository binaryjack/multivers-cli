import { setGlobalRoot } from '../../helpers/utils.js'
import { getComponent } from '../db/getComponent.js'
import { getVersionNumber } from '../db/getVersionNumber.js'
import { infoMsg } from '../errors/helpers.js'
import { clearVersion } from './clearVersion.js'

/**
 * Clears the physical versioned files.
 * @param root string
 * @param component string
 * @param searchWhere string
 * @param version string
 * @returns void
 */
export const getFilesVersionsAndClear = async (
    root: string,
    component: string,
    searchWhere: string,
    version: string
) => {
    setGlobalRoot(root)

    const foundComponent = getComponent(component, searchWhere)
    if (!foundComponent) return

    const requestedVersion = getVersionNumber(foundComponent.fullName, version)
    if (!requestedVersion) return

    await clearVersion(foundComponent.fullName, requestedVersion)

    infoMsg(
        'Clear version files',
        `Process Complete - requested version: ": ${requestedVersion}`
    )
}
