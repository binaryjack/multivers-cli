import fs from 'fs'

import fileManager from './fileManager.js'
import chalk from 'chalk'
import yesno from 'yesno'
import progress from './progress.js'

const clearFiles = (root) => {
    global.rootDirectory = root

    const { baseDbDirectory, getAllFilesNoSkip } = fileManager()

    const clearAll = async (folder) => {
        const ok = await yesno({
            question:
                'This will remove all files and versions but not the project files produced with it, continue?',
            invalid: function ({
                question,
                defaultValue,
                yesValues,
                noValues,
            }) {
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
                } catch (e) {
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

    clearAll(baseDbDirectory)
}

export default clearFiles
