import { setGlobalRoot } from '../../helpers/utils.js'
import { deleteFiles } from '../clearFiles/clearAll.js'
import { addItem } from '../db/addItem.js'
import { InDb } from '../db/db.js'
import { saveFiles } from '../db/saveFiles.js'
import { dependenciesParser } from '../dependenciesParser/dependenciesParser.js'
import { infoMsg } from '../errors/helpers.js'
import { fileManager } from '../filesManager/filesManager.js'
import { recursFiles } from './recursFile.js'

/**
 * Loop all project files and build dependencies from imports
 * @param root
 * @param overwrite
 */
export const loopProjectFiles = (root: string, overwrite?: boolean) => {
    setGlobalRoot(root)

    if (overwrite) {
        const { baseDbDirectory, filesKeyName, dependenciesKeyName } =
            fileManager()

        deleteFiles(baseDbDirectory, [filesKeyName, dependenciesKeyName], false)
    }

    const { files } = InDb()

    const collectedFiles = recursFiles(global.rootDirectory)

    for (const file of collectedFiles) {
        addItem(files, file)
    }

    saveFiles(collectedFiles)
    dependenciesParser()

    infoMsg(
        'loopProjectFiles',
        `Process Complete - Output Files: ": ${collectedFiles.length}`
    )
}
