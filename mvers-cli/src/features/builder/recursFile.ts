import fs from 'fs'

import { IFile } from '../../models/interop.js'
import { trimFromSrcDirectory } from '../arrayParsers/trimFromSrcDirectory.js'
import { skipDirectory } from '../filesManager/skipDirectory.js'
import { getExtension } from '../stringParsers/getExtension.js'
import { splitAndTrim } from '../stringParsers/splitAndTrim.js'

export const recursFiles = (path: string, output: IFile[] = []): IFile[] => {
    if (skipDirectory(path)) return output
    // const { incr } = progress()
    // incr(path)

    const fileList = fs.readdirSync(path)
    for (const file of fileList) {
        // inc§(file)

        const currentFile = `${path}\\${file}`
        if (fs.statSync(currentFile).isDirectory()) {
            recursFiles(currentFile, output)
        } else {
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
