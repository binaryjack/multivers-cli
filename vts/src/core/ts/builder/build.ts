import { addItem } from '../db/addItem.js'
import { InDb } from '../db/db.js'
import { saveFiles } from '../db/saveFiles.js'
import { dependenciesParser } from '../dependenciesParser/dependenciesParser.js'
import filesManager from '../filesManager/index.js'
import progress from '../progress/index.js'
import { recursFiles } from './recursFile.js'

export const build = (startFolder: string) => {
    global.rootDirectory = startFolder

    console.log('build', global.rootDirectory)

    const { files, directoryName } = InDb()
    const { countFilesInDirectory } = filesManager()

    const count = countFilesInDirectory(startFolder) ?? 0
    const { start, stop, info } = progress()

    start(count)
    const collectedFiles = recursFiles(directoryName)
    stop()

    for (const file of collectedFiles) {
        addItem(files, file)
    }

    info('Process finished')

    saveFiles(files)
    dependenciesParser()
}

///module.export = { build }
