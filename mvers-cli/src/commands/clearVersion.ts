import { Command } from 'commander'

import clearVersionsProjectFiles from '../features/clearVersionsProjectFiles/index.js'
import { currentExecturingDir } from './commandsInit.js'

export const clearVCommand = (cmd: Command) => {
    cmd.command('clear-v')
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
        .action((options) => {
            console.log(
                clearVersionsProjectFiles(
                    options.basePath ?? currentExecturingDir,
                    options.component,
                    options.searchWhere,
                    options.version
                )
            )
        })
}
