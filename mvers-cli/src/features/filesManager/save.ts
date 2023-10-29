import fs from 'fs'

import { errMsg } from '../errors/helpers.js'

export const save = (
    fileName: string,
    backupfunction: (stamp: string) => string,
    data: any
) => {
    try {
        const dte = new Date()
        const stamp = `${dte.getDate()}${dte.getHours()}${dte.getMinutes()}${dte.getMilliseconds()}`
        if (fs.existsSync(fileName)) {
            fs.renameSync(fileName, backupfunction(stamp))
        }
        if (fs.existsSync(fileName)) {
            fs.unlinkSync(fileName)
        }
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2))
    } catch (err: any) {
        errMsg('save', err)
    }
}
