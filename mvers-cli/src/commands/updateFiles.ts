import { Command } from 'commander'

import updateFiles from '../features/updateFile/index.js'
import { currentExecturingDir } from './commandsInit.js'

export const updateCommand = (cmd: Command) => {
    cmd.command('update')
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
        .option('-v, --version <version>', 'provide the version to remove')
        .option('-o, --overwrite', 'overwrite existing files')
        .action((options) => {
            console.log(
                updateFiles(
                    options.basePath ?? currentExecturingDir,
                    options.component,
                    options.searchWhere,
                    options.version,
                    options.overwrite
                )
            )
        })
}
