import fs from 'fs'
import yesno from 'yesno'

import { errMsg } from '../errors/helpers.js'
import { getAllFilesNoSkip } from '../filesManager/getAllFilesNoSkip.js'
import { ProgressBar } from '../progress/progress.js'

export const clearAll = async (folder: string) => {
    const ok = await yesno({
        question:
            'This will remove all files and versions but not the project files produced with it, continue?',
        invalid: function ({ question, defaultValue, yesValues, noValues }) {
            process.stdout.write('\n Process aborted')
            process.exit(1)
        },
    })

    const files = getAllFilesNoSkip(folder)
    const filesCount = files.length

    const pbar = new ProgressBar(25, filesCount)
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
    if (deletedFiles.length === filesCount)
        fs.rmSync(folder, { recursive: true, force: true })
}
