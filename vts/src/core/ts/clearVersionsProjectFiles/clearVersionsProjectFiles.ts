import { getComponent } from '../db/getComponent.js'
import { getVersionNumber } from '../db/getVersionNumber.js'
import { clearVersion } from './clearVersion.js'

export const clearVersionsProjectFiles = (
    root: string,
    component: string,
    searchWhere: string,
    version: string
) => {
    global.rootDirectory = root

    // get the component
    const foundComponent = getComponent(component, searchWhere)
    if (!foundComponent) return

    const requestedVersion = getVersionNumber(foundComponent.fullName, version)
    if (!requestedVersion) return

    clearVersion(foundComponent.fullName, requestedVersion)
}
