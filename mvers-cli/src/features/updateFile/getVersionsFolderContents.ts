import fs from 'fs'

import { IVersionContent, IVersionFolders } from '../../models/interop.js'

/**
 * Gets the Version Folder Contents
 * @param path string
 * @returns IVersionFolders
 */
export const getVersionsFolderContents = (path: string): IVersionFolders => {
    const versionDirectories = fs
        .readdirSync(path, { withFileTypes: true })
        .filter((d1) => d1.isDirectory())
        .filter((d) => /^V\d+$/.test(d.name))
        .map((d) => d.name)

    const output: IVersionContent[] = []

    for (const f of versionDirectories) {
        const files = fs
            .readdirSync(path, { withFileTypes: true })
            .filter((d) => d.isFile())
            .map((d) => d.name)

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
