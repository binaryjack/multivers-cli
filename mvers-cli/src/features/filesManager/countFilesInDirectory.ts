import { errMsg } from '../errors/helpers.js'
import { getAllFiles } from './getAllFiles.js'

/**
 * Counts the files in a given directory
 * @param dirPath
 * @returns
 */
export const countFilesInDirectory = (dirPath: string) => {
    try {
        return getAllFiles(dirPath)?.length
    } catch (err) {
        errMsg('countFilesInDirectory', err)
    }
}
