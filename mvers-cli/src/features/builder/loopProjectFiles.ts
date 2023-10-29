import { setGlobalRoot } from '../../helpers/utils.js'
import clearFiles from '../clearFiles/index.js'
import { addItem } from '../db/addItem.js'
import { InDb } from '../db/db.js'
import { saveFiles } from '../db/saveFiles.js'
import { dependenciesParser } from '../dependenciesParser/dependenciesParser.js'
import filesManager from '../filesManager/index.js'
import { ProgressBar } from '../progress/progress.js'
import { recursFiles } from './recursFile.js'

export const loopProjectFiles = (root: string, overwrite?: boolean) => {
    setGlobalRoot(root)

    overwrite && clearFiles(global.rootDirectory)

    const { files } = InDb()
    const { countFilesInDirectory } = filesManager()

    const count = countFilesInDirectory(global.rootDirectory) ?? 0
    const pbar = new ProgressBar(25, count)

    const collectedFiles = recursFiles(global.rootDirectory, pbar)

    for (const file of collectedFiles) {
        addItem(files, file)
    }

    saveFiles(files)
    dependenciesParser()
}
