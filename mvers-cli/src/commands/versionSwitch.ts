import chalk from 'chalk'
import { Command } from 'commander'

import { versionManager } from '../features/versionManager/versionManager.js'
import { currentExecturingDir } from './commandsInit.js'

export const versionSwitchCommand = (cmd: Command) => {
    cmd.command('v-up')
        .option(
            '-b, --basePath [basePath]',
            'optional, provide a base path otherwise it will take the rooth project path where you invoke the tool'
        )
        .option('-c, --component <component>', 'provide a component name')
        .option(
            '-sw, --searchWhere [searchWhere]',
            'search where : in name (component name: takes the first occurency)/ in fullName (full component path)',
            'fullName.contains'
        )

        .action((options) => {
            console.log(
                `executing version up for: `,
                chalk.green(
                    options.basePath ?? currentExecturingDir,
                    options.component,
                    options.searchWhere
                )
            )

            console.log(
                versionManager(
                    options.basePath ?? currentExecturingDir,
                    options.component,
                    options.searchWhere,
                    'up'
                )
            )
        })

    cmd.command('v-down')

        .option('-c, --component <component>', 'provide a component name')
        .option(
            '-sw, --searchWhere [searchWhere]',
            'search where : in name (component name: takes the first occurency)/ in fullName (full component path)',
            'fullName.contains'
        )

        .action((options) => {
            console.log(
                `executing version down for: `,
                chalk.green(
                    currentExecturingDir,
                    options.component,
                    options.searchWhere
                )
            )

            console.log(
                versionManager(
                    currentExecturingDir,
                    options.component,
                    options.searchWhere,
                    'down'
                )
            )
        })
}
