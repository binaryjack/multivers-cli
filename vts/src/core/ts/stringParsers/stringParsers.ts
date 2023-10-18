import { getExtension } from './getExtension.js'
import { isNotProjectImport } from './isNotProjectImport.js'
import { replaceAll } from './replaceAll.js'
import { sanitize } from './sanitize.js'
import { sanitizeCollection } from './sanitizeCollection.js'
import { splitAndTrim } from './splitAndTrim.js'
import { takeFolderUntil } from './takeFolderUntil.js'

export const stringParsers = () => {
    return {
        takeFolderUntil,
        getExtension,
        sanitizeCollection,
        replaceAll,
        sanitize,
        isNotProjectImport,
        splitAndTrim,
    }
}
