import { setGlobalRoot } from '../../helpers/utils.js'
import { infoMsg } from '../errors/helpers.js'
import { fileManager } from '../filesManager/filesManager.js'
import { clearAll } from './clearAll.js'

/**
 * Will clear mvers files
 * @param root
 */
export const clearFiles = (root: string) => {
    setGlobalRoot(root)

    const { baseDbDirectory } = fileManager()

    clearAll(baseDbDirectory)

    infoMsg(
        'clearFiles',
        `Process Complete - working directory: ": ${baseDbDirectory}`
    )
}
