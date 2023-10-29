import { IFile } from '../../models/interop.js'
import { fileManager } from '../filesManager/filesManager.js'
import { save } from '../filesManager/save.js'

export const saveFiles = (files: IFile[]) => {
    const { filesKeyName, bakFilesKeyName } = fileManager()
    save(filesKeyName, bakFilesKeyName, files)
}
