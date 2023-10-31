import fs from 'fs'

import { IFile } from '../../models/interop.js'
import { skipDirectory } from '../filesManager/skipDirectory.js'
import { skipFile } from '../filesManager/skipFile.js'
import { getExtension } from '../helpers/getExtension.js'
import { splitAndTrim } from '../helpers/splitAndTrim.js'
import { trimFromSrcDirectory } from '../helpers/trimFromSrcDirectory.js'
import { ProgressBar } from '../progress/progress.js'

/**
 *
 * @param path Loop recursively all files and extract them
 * Note: the settings provides a directories and files list and will skip them
 * * @param output
 * @returns
 */
export const recursFiles = (path: string, output: IFile[] = []): IFile[] => {
    if (skipDirectory(path)) return output

    const fileList = fs.readdirSync(path)

    const pbar = new ProgressBar(25, fileList.length)

    for (const file of fileList) {
        const currentFile = `${path}\\${file}`

        pbar.increment(`recursFiles: ${currentFile}`)

        if (fs.statSync(currentFile).isDirectory()) {
            recursFiles(currentFile, output)
        } else {
            if (skipFile(currentFile)) continue
            const splittedPath = splitAndTrim(path, '\\')
            const filePathFromSrc = trimFromSrcDirectory(splittedPath)
            const filePathWithFileName = [...filePathFromSrc, file]
            const fileDesc: IFile = {
                id: output.length === 0 ? 0 : output.length + 1,
                file: getExtension(file),
                filePathFromSrc: filePathFromSrc,
                fullName: filePathWithFileName.join('\\'),
            }
            output.push(fileDesc)
        }
    }
    return output
}
