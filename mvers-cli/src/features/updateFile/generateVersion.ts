import chalk from 'chalk'
import cliProgress from 'cli-progress'
import fs from 'fs'

import { IExistingVersion, IVersionContent } from '../../models/interop.js'
import { errMsg } from '../errors/helpers.js'

export const generateVersion = (
    filesCollection: IExistingVersion[],
    requestedVersion: number,
    maxCount: number,
    overwrite: boolean
): IVersionContent[] | undefined => {
    if (!Array.isArray(filesCollection) || !requestedVersion || maxCount === 0)
        return

    const b1 = new cliProgress.SingleBar({
        format:
            'CLI Progress |' +
            chalk.greenBright('{bar}') +
            '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        forceRedraw: true,
        hideCursor: true,
    })

    const counters = filesCollection.reduce((acc, currentItem) => {
        const count = currentItem?.rootContents?.files?.length
        if (typeof acc === 'object') {
            acc = 0
        }
        return acc + count
    }, 0)

    b1.start((counters * filesCollection.length) / 100, 0, {
        speed: 'N/A',
    })

    const output: IVersionContent[] = []

    let inc = 0
    for (const f of filesCollection) {
        const vFolderName = `${f.rootContents.folder}\\V${requestedVersion}`

        if (!fs?.existsSync(vFolderName)) {
            fs?.mkdirSync(vFolderName)
        }
        const newFileOutputVersion: IVersionContent = {
            folder: vFolderName,
            files: [],
        }

        inc++
        b1.increment(inc, { payload: `=> ${vFolderName}` })

        for (const fToCopy of f.rootContents.files) {
            const originPath = `${f.rootContents.folder}\\${fToCopy}`
            const targetPath = `${vFolderName}\\${fToCopy}`

            if (overwrite) {
                if (fs?.existsSync(targetPath)) {
                    try {
                        fs?.unlinkSync(targetPath)
                    } catch (e: any) {
                        errMsg('', ` ${e.message}! cannot delete ${targetPath}`)
                    }
                }
            }
            if (!fs?.existsSync(targetPath)) {
                fs?.copyFileSync(originPath, targetPath)
            }
            newFileOutputVersion.files.push(targetPath)
        }
        output.push(newFileOutputVersion)
    }
    b1.stop()

    return output
}
