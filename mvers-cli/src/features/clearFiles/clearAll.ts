import fs from 'fs'

import { errMsg } from '../errors/helpers.js'
import { getAllFilesNoSkip } from '../filesManager/getAllFilesNoSkip.js'
import { ProgressBar } from '../progress/progress.js'

/**
 * Will clear mvers files
 * @param folder
 */
export const clearAll = (folder: string) => {
    const I = ''
    // yesno({
    //     question:
    //         'This will remove all files and versions but not the project files produced with it, continue?',
    //     yesValues: ['y', 'Y'],
    //     noValues: ['n', 'N'],
    // })

    const files = getAllFilesNoSkip(folder)

    deleteFiles(folder, files, true)
}

export const deleteFiles = (
    folder: string,
    files: string[],
    keepFolder: boolean
) => {
    const pbar = new ProgressBar(25, files.length)
    const deletedFiles = []
    for (const f of files) {
        pbar.increment(`deleting => ${f}`)

        if (fs?.existsSync(f)) {
            try {
                fs?.unlinkSync(f)
                deletedFiles.push(f)
            } catch (e: any) {
                errMsg('clearAll', `ERROR: ", ${e.message}! cannot delete ${f}`)
            }
        }
    }
    if (!keepFolder) return
    if (deletedFiles.length === files.length)
        fs.rmSync(folder, { recursive: true, force: true })
}
