import { Command } from 'commander'

import { getComponentDependencyChart } from '../features/getComponentDependencyChart/getComponentDependencyChart.js'
import { currentExecutingDir } from './commandsInit.js'

/**
 * this command will build the dependencies chart whith the help of `mermaid.js` `https://mermaid.js.org/`
 * @param cmd Command instance
 */
export const buildDependencyCommand = (cmd: Command) => {
    cmd.command('deps')
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
        .option(
            '-r, --recursively',
            'run dependency builder recursively',
            false
        )
        .action((options) => {
            console.log(
                getComponentDependencyChart(
                    options.basePath ?? currentExecutingDir,
                    options.component,
                    options.searchWhere,
                    options.recursively
                )
            )
        })
}
