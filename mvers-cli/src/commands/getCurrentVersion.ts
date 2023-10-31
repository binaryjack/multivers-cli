import { Command } from 'commander'

import { getVersions } from '../features/getVersions/getVersions.js'
import { currentExecutingDir } from './commandsInit.js'

/**
 * This will return the current version
 * @param cmd Command instance
 */
export const currentVCommand = (cmd: Command) => {
    cmd.command('current-v')
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

        .action((options) => {
            console.log(
                getVersions(
                    options.basePath ?? currentExecutingDir,
                    options.component,
                    options.searchWhere
                )
            )
        })
}
