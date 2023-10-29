import fs from 'fs'

import { setGlobalRoot } from '../helpers/utils.js'
import { localSettingsName } from './constants.js'
import settings from './settings.js'

export const initLocalSettings = (root: string, overwrite: boolean) => {
    const outputSettings = settings()
    setGlobalRoot(root)

    const settingsname = `${global.rootDirectory}\\${localSettingsName}`

    if (fs.existsSync(settingsname)) {
        fs.unlinkSync(settingsname)
    }
    fs.writeFileSync(settingsname, JSON.stringify(outputSettings, null, 2))
}
