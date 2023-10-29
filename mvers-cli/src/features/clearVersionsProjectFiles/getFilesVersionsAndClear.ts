import { setGlobalRoot } from '../../helpers/utils.js'
import { getComponent } from '../db/getComponent.js'
import { getVersionNumber } from '../db/getVersionNumber.js'
import { clearVersion } from './clearVersion.js'

export const getFilesVersionsAndClear = (
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

    clearVersion(foundComponent.fullName, requestedVersion)
}
