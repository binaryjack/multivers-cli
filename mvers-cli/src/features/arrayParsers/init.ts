import { IDependency } from '../../models/interop.js'
import { asVersion } from '../stringParsers/init.js'
import { buildPathLeftOffset } from './buildPathOffset.js'
import { buildVersionPath } from './buildVersionPath.js'

export const getPathList = (fullName: string) => fullName.split('\\')

export const getFullComponentPath = (component: IDependency, version: number) =>
    `${global.rootDirectory}\\${buildVersionPath(
        component.filePathFromSrc,
        version
    )}\\${component.file.name}.${component.file.extension}`

export const getFullComponentPahthFromSrc = (
    component: IDependency,
    version: number
) =>
    `${buildPathLeftOffset(component.filePathFromSrc, 1)}\\${asVersion(
        version
    )}`
