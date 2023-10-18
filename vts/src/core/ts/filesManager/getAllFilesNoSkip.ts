import fs from 'fs'
import path from 'path'

import progress from '../progress/index.js'
import { getAllFiles } from './getAllFiles.js'

export const getAllFilesNoSkip = (
    directory: string,
    files: string[] = []
): string[] => {
    const { infinite } = progress()
    const filesInDirectory = fs.readdirSync(directory)
    infinite(directory)
    for (const file of filesInDirectory) {
        const absolute = path.join(directory, file)
        infinite(absolute)
        if (fs.statSync(absolute).isDirectory()) {
            getAllFiles(absolute, files)
        } else {
            files.push(absolute)
        }
    }
    return files
}
