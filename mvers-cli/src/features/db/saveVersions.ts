import { IVersion } from '../../models/interop.js'
import { fileManager } from '../filesManager/filesManager.js'
import { save } from '../filesManager/save.js'

/**
 * Will save the version file
 * @param versions
 */
export const saveVersions = (versions: IVersion[]) => {
    const { versionsKeyName, bakVersionsKeyName } = fileManager()
    save(versionsKeyName, bakVersionsKeyName, versions)
}
