import { Command } from 'commander'

import { getVersions } from '../features/getVersions/getVersions.js'
import { currentExecturingDir } from './commandsInit.js'

export const currentVCommand = (cmd: Command) => {
    cmd.command('current-v')
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
                getVersions(
                    options.basePath ?? currentExecturingDir,
                    options.component,
                    options.searchWhere
                )
            )
        })
}
