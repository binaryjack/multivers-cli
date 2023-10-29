import { Command } from 'commander'

import { initLocalSettings } from '../features/initLocalSettings.js'
import { currentExecturingDir } from './commandsInit.js'

export const initConfig = (cmd: Command) => {
    cmd.command('init-conf')
        .option(
            '-b, --basePath [basePath]',
            'optional, provide a base path otherwise it will take the rooth project path where you invoke the tool'
        )
        .option('-o, --overwrite', 'overwrite existing files')
        .action((options) => {
            console.log(
                initLocalSettings(
                    options.basePath ?? currentExecturingDir,
                    options.overwrite
                )
            )
        })
}
