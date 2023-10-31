import { Command } from 'commander'

import {
    testInfiniteProgressBar,
    testProgressBar,
} from '../features/progress/progress.js'

/**
 * For development phase only
 * @param cmd Command instance
 */
export const testProgress = (cmd: Command) => {
    cmd.command('test').action((options) => {
        console.log(testProgressBar())
    })

    cmd.command('test-infinite').action((options) => {
        console.log(testInfiniteProgressBar())
    })
}
