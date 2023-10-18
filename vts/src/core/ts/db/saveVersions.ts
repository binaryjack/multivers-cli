import { fileManager } from '../filesManager/filesManager.js'
import { save } from '../filesManager/save.js'
import { IVersion } from './db.js'

export const saveVersions = (versions: IVersion[]) => {
    const { versionsKeyName, bakVersionsKeyName } = fileManager()
    save(versionsKeyName, bakVersionsKeyName, versions)
}
