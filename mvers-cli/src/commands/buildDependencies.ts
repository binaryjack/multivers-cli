import { Command } from 'commander'

import { getComponentDependencyChart } from '../features/getComponentDependencyChart/getComponentDependencyChart.js'
import { currentExecturingDir } from './commandsInit.js'

export const buildDependencyCommand = (cmd: Command) => {
    cmd.command('deps')
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
        .option(
            '-r, --recursively',
            'run dependency builder recursively',
            false
        )
        .action((options) => {
            console.log(
                getComponentDependencyChart(
                    options.basePath ?? currentExecturingDir,
                    options.component,
                    options.searchWhere,
                    options.recursively
                )
            )
        })
}
