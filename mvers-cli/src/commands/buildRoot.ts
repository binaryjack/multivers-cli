#! /usr/bin/env node

import { Command } from 'commander'

import { loopProjectFiles } from '../features/builder/loopProjectFiles.js'
import { currentExecutingDir } from './commandsInit.js'

/**
 * this command will parse all the folders and files recursively and prebuild the dependencies from their imports
 * NOTE: the result is impacted by the settings (files/folders omittance)
 * @param cmd Command instance
 */
export const buildCommand = (cmd: Command) => {
    cmd.command('builder')
        .option(
            '-b, --basePath [basePath]',
            'optional, provide a base path otherwise it will take the root project path where you invoke the tool'
        )
        .action((options) =>
            console.log(
                loopProjectFiles(options.basePath ?? currentExecutingDir)
            )
        )
}
