import { IDependency } from '../../models/interop.js'
import { asVersion } from './asVersion.js'
import { buildPathLeftOffset } from './buildPathLeftOffset.js'

/**
 * Gets the full component path from src dir
 * @param component
 * @param version
 * @returns
 */
export const getFullComponentPathFromSrc = (
    component: IDependency,
    version: number
): string =>
    `${buildPathLeftOffset(component.filePathFromSrc, 1)}\\${asVersion(
        version
    )}`
