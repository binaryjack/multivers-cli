import fs from 'fs'

import { errMsg } from '../errors/helpers.js'

/**
 * Saves the content to a file
 * @param fileName
 * @param backupFunction
 * @param data
 */
export const save = (
    fileName: string,
    backupFunction: (stamp: string) => string,
    data: any
) => {
    try {
        const dte = new Date()
        const stamp = `${dte.getDate()}${dte.getHours()}${dte.getMinutes()}${dte.getMilliseconds()}`
        if (fs.existsSync(fileName)) {
            fs.renameSync(fileName, backupFunction(stamp))
        }
        if (fs.existsSync(fileName)) {
            fs.unlinkSync(fileName)
        }
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2))
    } catch (err: any) {
        errMsg('save', err)
    }
}
