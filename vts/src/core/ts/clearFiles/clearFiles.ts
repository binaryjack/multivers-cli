import { fileManager } from '../filesManager/filesManager.js'
import { clearAll } from './clearAll.js'

export const clearFiles = (root: string) => {
    global.rootDirectory = root

    const { baseDbDirectory } = fileManager()

    clearAll(baseDbDirectory)
}
