import fs from 'fs'
import path from 'path'

import { skipDirectory } from './skipDirectory.js'

export const getAllFiles = (
    directory: string,
    files: string[] = []
): string[] => {
    // const { infinite } = progress()
    if (skipDirectory(directory)) return files
    const filesInDirectory = fs.readdirSync(directory)
    // infinite(directory)
    for (const file of filesInDirectory) {
        const absolute = path.join(directory, file)
        // infinite(absolute)
        if (fs.statSync(absolute).isDirectory()) {
            getAllFiles(absolute, files)
        } else {
            files.push(absolute)
        }
    }
    return files
}
