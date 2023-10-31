import fs from 'fs'

import { setGlobalRoot } from '../helpers/utils.js'
import { localSettingsName } from './constants.js'
import { errMsg, infoMsg } from './errors/helpers.js'
import settings from './settings.js'

/**
 *
 * @param root
 * @param overwrite
 * @returns
 */
export const initLocalSettings = (root: string, overwrite: boolean) => {
    const outputSettings = settings()
    setGlobalRoot(root)

    const settingsName = `${global.rootDirectory}\\${localSettingsName}`

    if (fs.existsSync(settingsName)) {
        if (overwrite) {
            fs.unlinkSync(settingsName)
        } else {
            errMsg(
                'Create local settings file',
                `A local config file was found! if you want to overwrite it, append -o parameter and try again.`
            )
            return
        }
    }
    fs.writeFileSync(settingsName, JSON.stringify(outputSettings, null, 2))

    infoMsg(
        'Create local settings file',
        `Process Complete: your local settings file: ${settingsName}`
    )
}
