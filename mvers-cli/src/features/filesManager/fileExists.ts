import { replaceAll } from '../stringParsers/replaceAll.js'
import { getAllFilesNoSkip } from './getAllFilesNoSkip.js'

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
