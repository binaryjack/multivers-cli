import { IImports } from '../../models/interop.js'
import { isNotProjectImport } from './isNotProjectImport.js'
import { sanitizeCollection } from './sanitizeCollection.js'
import { splitAndTrim } from './splitAndTrim.js'

/**
 * Splits and trims the import path and imported item into @returns IImports type
 * @param importString
 * @returns IImports | undefined
 */
export const trimImportPath = (importString: string): IImports | undefined => {
    if (isNotProjectImport(importString)) return undefined
    const importSplitted = splitAndTrim(importString, 'from')
    const elements = splitAndTrim(importSplitted[0], ' ')
    const paths = splitAndTrim(importSplitted[1], '/')

    return {
        objects: sanitizeCollection(elements),
        paths: sanitizeCollection(paths),
    }
}
