import chalk from 'chalk'
import fs from 'fs'
import yesno from 'yesno'

import { getAllFilesNoSkip } from '../filesManager/getAllFilesNoSkip.js'
import progress from '../progress/index.js'

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

    const { start, stop, incr } = progress()
    start(filesCount)
    const deletedFiles = []

    for (const f of files) {
        incr(`deleting => ${f}`)

        if (fs?.existsSync(f)) {
            try {
                fs?.unlinkSync(f)
                deletedFiles.push(f)
            } catch (e: any) {
                console.log(
                    chalk.red(`ERROR: ", ${e.message}! cannot delete ${f}`)
                )
            }
        }
    }
    stop()
    if (deletedFiles.length === filesCount)
        fs.rmSync(folder, { recursive: true, force: true })
}
