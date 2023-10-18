import fs from 'fs'

export const getRootFolderContents = (path: string) => {
    const files = fs
        .readdirSync(path, { withFileTypes: true })
        .filter((dirent) => dirent.isFile())
        .map((dirent) => dirent.name)

    return {
        folder: path,
        files: files,
    }
}
