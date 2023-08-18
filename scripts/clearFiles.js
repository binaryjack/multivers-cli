import fs from 'fs'

import fileManager from './fileManager.js'
import chalk from 'chalk'
import cliProgress from 'cli-progress'
import yesno from 'yesno'

const clearFiles = (root) => {
    global.rootDirectory = root

    const { baseDbDirectory, getAllFiles } = fileManager()

    const clearAll = async (folder) => {
        const b1 = new cliProgress.SingleBar({
            format:
                '{payload} |' +
                chalk.greenBright('{bar}') +
                '| {percentage}% || {value}/{total} Chunks ',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            linewrap: false,
            clearOnComplete: true,
            forceRedraw: false,
            hideCursor: true,
        })

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

        const files = getAllFiles(folder)
        const filesCount = files.length
        b1.start(filesCount, 0, {
            speed: 'N/A',
        })

        const deletedFiles = []

        for (const f of files) {
            b1.increment(1, { payload: `deleting => ${f}` })
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
        if (deletedFiles.length === filesCount)
            fs.rmSync(folder, { recursive: true, force: true })

        b1.stop()
    }

    clearAll(baseDbDirectory)
}

export default clearFiles
