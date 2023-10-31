import fs from 'fs'
import path from 'path'

import { getAllFiles } from './getAllFiles.js'

/**
 * Gets All files Recursively NO RESTRICTION FROM SETTINGS
 * @param directory
 * @param files
 * @returns
 */
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
