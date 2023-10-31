import { Command } from 'commander'

import { initLocalSettings } from '../features/initLocalSettings.js'
import { currentExecutingDir } from './commandsInit.js'

/**
 * This will initialize a settings.json file in the executing directory.
 * NOTE. during the mvr processes if any settings file is detected then it will replace the default settings.
 * @param cmd Command instance
 */
export const initConfig = (cmd: Command) => {
    cmd.command('init-conf')
        .option(
            '-b, --basePath [basePath]',
            'optional, provide a base path otherwise it will take the root project path where you invoke the tool'
        )
        .option('-o, --overwrite', 'overwrite existing files')
        .action((options) => {
            console.log(
                initLocalSettings(
                    options.basePath ?? currentExecutingDir,
                    options.overwrite
                )
            )
        })
}
