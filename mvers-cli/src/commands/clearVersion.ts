import { Command } from 'commander'

import { getFilesVersionsAndClear } from '../features/clearVersionsProjectFiles/getFilesVersionsAndClear.js'
import { currentExecutingDir } from './commandsInit.js'

/**
 * This command will clears out the versioned files (the physical ones)
 * @param cmd Command instance
 */
export const clearVCommand = (cmd: Command) => {
    cmd.command('clear-v')
        .option(
            '-b, --basePath [basePath]',
            'optional, provide a base path otherwise it will take the root project path where you invoke the tool'
        )
        .option('-c, --component <component>', 'provide a component name')
        .option(
            '-sw, --searchWhere [searchWhere]',
            'search where : in name (component name: takes the first occurrence)/ in fullName (full component path)',
            'fullName.contains'
        )
        .option('-v, --version <version>', 'provide the version to remove')
        .action((options) => {
            console.log(
                getFilesVersionsAndClear(
                    options.basePath ?? currentExecutingDir,
                    options.component,
                    options.searchWhere,
                    options.version
                )
            )
        })
}
