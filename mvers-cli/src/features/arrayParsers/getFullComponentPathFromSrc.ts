import { IDependency } from '../../models/interop.js'
import { asVersion } from '../stringParsers/init.js'
import { buildPathLeftOffset } from './buildPathLeftOffset.js'

export const getFullComponentPathFromSrc = (
    component: IDependency,
    version: number
) =>
    `${buildPathLeftOffset(component.filePathFromSrc, 1)}\\${asVersion(
        version
    )}`
