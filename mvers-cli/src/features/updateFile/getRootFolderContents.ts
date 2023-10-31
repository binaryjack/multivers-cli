import fs from 'fs'

import { IVersionContent } from '../../models/interop.js'

/**
 * Gets the root folder contents
 * @param path string
 * @returns IVersionContent
 */
export const getRootFolderContents = (path: string): IVersionContent => {
    const files = fs
        .readdirSync(path, { withFileTypes: true })
        .filter((dirent) => dirent.isFile())
        .map((dirent) => dirent.name)

    return {
        folder: path,
        files: files,
    }
}
