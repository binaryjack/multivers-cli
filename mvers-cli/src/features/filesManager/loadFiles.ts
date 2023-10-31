import fs from 'fs'

import { errMsg } from '../errors/helpers.js'

/**
 * Loads file content
 */
export const loadFiles = (fileName: string) => {
    try {
        if (fs.existsSync(fileName)) {
            const data: string = fs.readFileSync(fileName, {
                encoding: 'utf-8',
            })
            if (data) {
                return JSON.parse(data)
            }
            return []
        }
    } catch (err) {
        errMsg('loadFiles', err)
    }
    return []
}
