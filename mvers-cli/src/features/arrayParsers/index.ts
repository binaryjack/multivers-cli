// const sprs = require('./stringParser')

import { buildDependencyPath } from './buildDependencyPath.js'
import { buildPath } from './buildPath.js'
import { buildPathOffset } from './buildPathOffset.js'
import { buildVersionPath } from './buildVersionPath.js'
import { getLastItem } from './getLastItem.js'
import { insertInPath } from './insertInPath.js'
import { mergePathToImport } from './mergePathToImport.js'
import { offsetPathRight } from './offsetPathRight.js'
import { trimFromSrcDirectory } from './trimFromSrcDirectory.js'
import { trimImportPath } from './trimImportPath.js'

//https://js2ts.com/
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
        insertInPath,
        mergePathToImport,
    }
}
export default arrayParser

//module.exports = { arrayParser }
