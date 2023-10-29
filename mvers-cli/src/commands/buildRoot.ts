#! /usr/bin/env node

import { Command } from 'commander'

import { build } from '../features/builder/build.js'
import { currentExecturingDir } from './commandsInit.js'

export const buildCommand = (cmd: Command) => {
    cmd.command('builder')
        .option(
            '-b, --basePath [basePath]',
            'optional, provide a base path otherwise it will take the rooth project path where you invoke the tool'
        )
        .action((options) =>
            console.log(build(options.basePath ?? currentExecturingDir))
        )
}
