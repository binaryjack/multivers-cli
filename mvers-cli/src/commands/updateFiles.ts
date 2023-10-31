import { Command } from 'commander'

import { updateFiles } from '../features/updateFile/updateFile.js'
import { currentExecutingDir } from './commandsInit.js'

/**
 * This command will create the new files version copy
 * - it will redo the builder command and it will redo the dependency build too
 * - finally it will update the imports
 * @param cmd Command instance
 */
export const updateCommand = (cmd: Command) => {
    cmd.command('update')
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
        .option('-o, --overwrite', 'overwrite existing files')
        .action((options) => {
            console.log(
                updateFiles(
                    options.basePath ?? currentExecutingDir,
                    options.component,
                    options.searchWhere,
                    options.version,
                    options.overwrite
                )
            )
        })
}
