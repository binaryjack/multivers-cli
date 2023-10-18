import { fileManager } from '../filesManager/filesManager.js'
import { save } from '../filesManager/save.js'
import { IFile } from './db.js'

export const saveFiles = (files: IFile[]) => {
    const { filesKeyName, bakFilesKeyName } = fileManager()
    save(filesKeyName, bakFilesKeyName, files)
}
