import { isNotProjectImport } from '../stringParsers/isNotProjectImport.js';
import { sanitizeCollection } from '../stringParsers/sanitizeCollection.js';
import { splitAndTrim } from '../stringParsers/splitAndTrim.js';

export interface IImports {
    objects: string[]
    paths: string[]
}

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
