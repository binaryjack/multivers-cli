// const sprs = require('./stringParser')

import { buildDependencyPath } from './buildDependencyPath.js'
import { buildPath } from './buildPath.js'
import { buildPathLeftOffset } from './buildPathLeftOffset.js'
import { buildPathOffset } from './buildPathOffset.js'
import { buildVersionPath } from './buildVersionPath.js'
import { getFullComponentPath } from './getFullComponentPath.js'
import { getFullComponentPathFromSrc } from './getFullComponentPathFromSrc.js'
import { getLastItem } from './getLastItem.js'
import { getPathList } from './getPathList.js'
import { offsetPathRight } from './offsetPathRight.js'
import { trimFromSrcDirectory } from './trimFromSrcDirectory.js'
import { trimImportPath } from './trimImportPath.js'

const arrayParser = () => {
    return {
        trimFromSrcDirectory,
        trimImportPath,
        getLastItem,
        buildDependencyPath,
        buildVersionPath,
        buildPath,
        buildPathOffset,
        offsetPathRight,
        getPathList,
        getFullComponentPathFromSrc,
        getFullComponentPath,
        buildPathLeftOffset,
    }
}
export default arrayParser
