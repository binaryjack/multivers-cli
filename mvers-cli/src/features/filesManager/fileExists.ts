import { replaceAll } from '../helpers/replaceAll.js'
import { getAllFilesNoSkip } from './getAllFilesNoSkip.js'

/**
 * Checks if file exists recursively
 */
export const fileExists = (root: string, path: string, fileName: string) => {
    try {
        const pathToSearch = replaceAll(`${root}\\src\\${path}`, '/', '\\')
        const files = getAllFilesNoSkip(pathToSearch)
        for (const f of files) {
            if (f === fileName) {
                return true
            }
        }
    } catch {
        return false
    }
}
