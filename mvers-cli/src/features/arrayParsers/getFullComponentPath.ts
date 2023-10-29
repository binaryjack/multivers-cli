import { IDependency } from '../../models/interop.js'
import { buildVersionPath } from './buildVersionPath.js'

export const getFullComponentPath = (
    component: IDependency,
    version: number
): string =>
    `${global.rootDirectory}\\${buildVersionPath(
        component.filePathFromSrc,
        version
    )}\\${component.file.name}.${component.file.extension}`
