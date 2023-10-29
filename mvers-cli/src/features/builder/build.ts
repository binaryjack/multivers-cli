import { setGlobalRoot } from '../../helpers/utils.js'
import clearFiles from '../clearFiles/index.js'
import { addItem } from '../db/addItem.js'
import { InDb } from '../db/db.js'
import { saveFiles } from '../db/saveFiles.js'
import { dependenciesParser } from '../dependenciesParser/dependenciesParser.js'
import filesManager from '../filesManager/index.js'
import { recursFiles } from './recursFile.js'

export const build = (root: string, overwrite?: boolean) => {
    setGlobalRoot(root)

    overwrite && clearFiles(global.rootDirectory)

    const { files } = InDb()
    const { countFilesInDirectory } = filesManager()

    const count = countFilesInDirectory(global.rootDirectory) ?? 0
    //const { start, stop, info } = progress()

    // start(count)
    const collectedFiles = recursFiles(global.rootDirectory)
    //stop()

    for (const file of collectedFiles) {
        addItem(files, file)
    }

    // info('Process finished')

    saveFiles(files)
    dependenciesParser()
}

///module.export = { build }
