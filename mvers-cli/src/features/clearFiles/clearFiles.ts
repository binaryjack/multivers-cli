import { setGlobalRoot } from '../../helpers/utils.js'
import { fileManager } from '../filesManager/filesManager.js'
import { clearAll } from './clearAll.js'

export const clearFiles = (root: string) => {
    setGlobalRoot(root)

    const { baseDbDirectory } = fileManager()

    clearAll(baseDbDirectory)
}
