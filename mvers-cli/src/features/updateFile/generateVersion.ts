import fs from 'fs'

import { IExistingVersion, IVersionContent } from '../../models/interop.js'
import { errMsg } from '../errors/helpers.js'
import { ProgressBar } from '../progress/progress.js'

/**
 * Will generate (Copy/Clone/Create) files / folders for the planed versions
 * @param filesCollection  IExistingVersion[]
 * @param requestedVersion number
 * @param maxCount number
 * @param overwrite boolean
 * @returns  IVersionContent[] | undefined
 */
export const generateVersion = (
    filesCollection: IExistingVersion[],
    requestedVersion: number,
    maxCount: number,
    overwrite: boolean
): IVersionContent[] | undefined => {
    if (!Array.isArray(filesCollection) || !requestedVersion || maxCount === 0)
        return

    const counters = filesCollection.reduce((acc, currentItem) => {
        const count = currentItem?.rootContents?.files?.length
        if (typeof acc === 'object') {
            acc = 0
        }
        return acc + count
    }, 0)

    const pbar = new ProgressBar(25, counters)

    const output: IVersionContent[] = []

    for (const f of filesCollection) {
        const vFolderName = `${f.rootContents.folder}\\V${requestedVersion}`

        if (!fs?.existsSync(vFolderName)) {
            fs?.mkdirSync(vFolderName)
        }
        const newFileOutputVersion: IVersionContent = {
            folder: vFolderName,
            files: [],
        }

        pbar.increment(`=> ${vFolderName}`)

        for (const fToCopy of f.rootContents.files) {
            const originPath = `${f.rootContents.folder}\\${fToCopy}`
            const targetPath = `${vFolderName}\\${fToCopy}`

            if (overwrite) {
                if (fs?.existsSync(targetPath)) {
                    try {
                        fs?.unlinkSync(targetPath)
                    } catch (e: any) {
                        errMsg(
                            'generateVersion',
                            ` ${e.message}! cannot delete ${targetPath}`
                        )
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

    return output
}
