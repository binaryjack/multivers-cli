import { Command } from 'commander'

const currentExecturingDir = process.cwd()

const mainProgram = new Command()

mainProgram
    .name('mvers-cli')
    .alias('mvr')
    .description('IFile IVersion Manager')
    .version('0.1.0')

export { mainProgram, currentExecturingDir }
