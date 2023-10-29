import { errMsg } from '../errors/helpers.js'
import { getAllFiles } from './getAllFiles.js'

export const countFilesInDirectory = (dirPath: string) => {
    try {
        return getAllFiles(dirPath)?.length
    } catch (err) {
        errMsg('countFilesInDirectory', err)
    }
}
