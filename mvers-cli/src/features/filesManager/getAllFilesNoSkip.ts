import fs from 'fs'
import path from 'path'

import { getAllFiles } from './getAllFiles.js'

export const getAllFilesNoSkip = (
    directory: string,
    files: string[] = []
): string[] => {
    const filesInDirectory = fs.readdirSync(directory)
    for (const file of filesInDirectory) {
        const absolute = path.join(directory, file)
        if (fs.statSync(absolute).isDirectory()) {
            getAllFiles(absolute, files)
        } else {
            files.push(absolute)
        }
    }
    return files
}
