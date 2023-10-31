import { Command } from 'commander'

import { clearFiles } from '../features/clearFiles/clearFiles.js'
import { currentExecutingDir } from './commandsInit.js'

/**
 * This command will clears out the mvr files in the version folder.
 * @param cmd Command instance
 */
export const clearCommand = (cmd: Command) => {
    cmd.command('clear')
        .option(
            '-b, --basePath [basePath]',
            'optional, provide a base path otherwise it will take the root project path where you invoke the tool'
        )
        .action((options) => {
            console.log(clearFiles(options.basePath ?? currentExecutingDir))
        })
}
