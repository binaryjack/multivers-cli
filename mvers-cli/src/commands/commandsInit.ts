import { Command } from 'commander'

const currentExecutingDir = process.cwd()

const mainProgram = new Command()
/**
 * This is the main instance of commander
 * @param cmd Command instance
 */
mainProgram
    .name('mvers-cli')
    .alias('mvr')
    .description('IFile IVersion Manager')
    .version('0.1.0')

export { mainProgram, currentExecutingDir }
