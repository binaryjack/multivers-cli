import { getAllFiles } from './getAllFiles.js'

export const countFilesInDirectory = (dirPath: string) => {
    try {
        return getAllFiles(dirPath)?.length
    } catch (err) {
        console.log(err)
    }
}
