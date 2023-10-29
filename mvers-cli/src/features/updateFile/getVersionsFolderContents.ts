import fs from 'fs'

import { IVersionContent, IVersionFolders } from '../../models/interop.js'

export const getVersionsFolderContents = (path: string): IVersionFolders => {
    const versionDirectories = fs
        .readdirSync(path, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .filter((dirent) => /^V\d+$/.test(dirent.name))
        .map((dirent) => dirent.name)

    const output: IVersionContent[] = []

    for (const f of versionDirectories) {
        const files = fs
            .readdirSync(path, { withFileTypes: true })
            .filter((dirent) => dirent.isFile())
            .map((dirent) => dirent.name)

        output.push({
            folder: f,
            files: files,
        })
    }

    return {
        path: path,
        content: output,
    }
}
