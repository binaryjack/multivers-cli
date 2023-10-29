import fs from 'fs'

import { IVersionContent } from '../../models/interop.js'

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
