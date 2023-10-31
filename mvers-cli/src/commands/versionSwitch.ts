import chalk from 'chalk'
import { Command } from 'commander'

import { versionManager } from '../features/versionManager/versionManager.js'
import { currentExecutingDir } from './commandsInit.js'

/**
 * This command will create the version mapping up or down
 * @param cmd Command instance
 */
export const versionSwitchCommand = (cmd: Command) => {
    cmd.command('v-up')
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
                `executing version up for: `,
                chalk.green(
                    options.basePath ?? currentExecutingDir,
                    options.component,
                    options.searchWhere
                )
            )

            console.log(
                versionManager(
                    options.basePath ?? currentExecutingDir,
                    options.component,
                    options.searchWhere,
                    'up'
                )
            )
        })

    cmd.command('v-down')
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
                `executing version down for: `,
                chalk.green(
                    options.basePath ?? currentExecutingDir,
                    options.component,
                    options.searchWhere
                )
            )

            console.log(
                versionManager(
                    options.basePath ?? currentExecutingDir,
                    options.component,
                    options.searchWhere,
                    'down'
                )
            )
        })
}
