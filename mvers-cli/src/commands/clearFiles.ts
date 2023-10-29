import { Command } from 'commander'

import clearFiles from '../features/clearFiles/index.js'
import { currentExecturingDir } from './commandsInit.js'

export const clearCommand = (cmd: Command) => {
    cmd.command('clear')
        .option(
            '-b, --basePath [basePath]',
            'optional, provide a base path otherwise it will take the rooth project path where you invoke the tool'
        )
        .action((options) => {
            console.log(clearFiles(options.basePath ?? currentExecturingDir))
        })
}
