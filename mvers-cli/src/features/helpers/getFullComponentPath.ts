import { IDependency } from '../../models/interop.js'
import { buildVersionPath } from './buildVersionPath.js'

/**
 * Gets the Full component path
 * @param component
 * @param version
 * @returns
 */
export const getFullComponentPath = (
    component: IDependency,
    version: number
): string =>
    `${global.rootDirectory}\\${buildVersionPath(
        component.filePathFromSrc,
        version
    )}\\${component.file.name}.${component.file.extension}`
