#! /usr/bin/env node
import { Command } from 'commander'

//https://github.com/tj/commander.js?
import { orderPizza } from './feat.js'

const program = new Command()

program
    .name('mvers-cli')
    .alias('mvr')
    .description('IFile IVersion Manager')
    .version('0.1.0')

program
    .command('getpi')

    .option('-p, --peppers', 'Add peppers')
    .option('-P, --pineapple', 'Add pineapple')
    .option('-b, --bbq-sauce', 'Add bbq sauce')
    .option(
        '-c, --cheese [type]',
        'Add the specified type of cheese [marble]',
        'marble'
    )
    .action((str, options) => {
        console.log(orderPizza(options))
    })

program.parse()
