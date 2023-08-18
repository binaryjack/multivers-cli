#! /usr/bin/env node
import build from '../scripts/build.js'
import versionManager from '../scripts/versionManager.js'
import getVersions from '../scripts/getVersions.js'
import updateFiles from '../scripts/updateFiles.js'
import clearFiles from '../scripts/clearFiles.js'
import clearVersionsProjectFiles from '../scripts/clearVersionsProjectFiles.js'

import getComponentDependencyChart from '../scripts/getComponentDependencyChart.js'
import chalk from 'chalk'
import boxen from 'boxen'
import yargs from 'yargs/yargs'

import figlet from 'figlet'

const currentExecturingDir = process.cwd()

figlet('MULTIVERS', 'Standard', function (err, title) {
    if (err) {
        console.log('something went wrong...')
        console.dir(err)
        return
    }
    console.clear()
    const argv = yargs(process.argv.slice(2))
        .usage(
            chalk.green(
                '-p: or -process  <the process> \r\n -c or -component <name> : the component you want to parse'
            )
        )
        .options('p', {
            alias: 'process',
            describe: 'process to execute',
            default: '',
            type: 'string',
            demandOption: true,
        })
        .options('c', {
            alias: 'component',
            describe: 'component to parse',
            default: '',
            type: 'string',
            demandOption: false,
        })
        .options('sw', {
            alias: 'searchWhere',
            describe:
                'search where : in name (component name: takes the first occurency)/ in fullName (full component path)',
            default: 'fullName.contains',
            type: 'string',
            demandOption: false,
        })
        .options('d', {
            alias: 'direction',
            describe:
                'direction mode : up / down the version. Note! It will only prepare the version reference file it will also try to grab the existings physical folders versions previousely done with this tool.',
            default: 'up',
            type: 'string',
            demandOption: false,
        })
        .options('y', {
            alias: 'y_vers',
            describe:
                'version: "latest" = default,  or the version number prepared with process "v-up"',
            default: 'latest',
            type: 'string',
            demandOption: false,
        })
        .options('o', {
            alias: 'overwrite',
            describe: 'overwrite file',
            default: 'false',
            type: 'boolean',
            demandOption: false,
        })
        .demandOption(['process'], 'Please provide a process to execute')
        .help().argv

    console.log(
        boxen(
            `${chalk.redBright(title)}`,

            {
                padding: 2,
                width: '100',
                title: chalk.blueBright('v 1.0'),
                titleAlignment: 'center',
            }
        )
    )

    if (!argv.p || !argv.process) {
        console.log(chalk.bgYellow('USAGE:'))
        console.log(chalk.blueBright('mvers -p/-process = PROCESS'))
        console.log(chalk.yellowBright('Processes:'))
        console.log(
            chalk.yellowBright(
                "- build: 'Dependency Database' creates the dependency database of the current project. as long as the projects has a src folder."
            )
        )
        console.log(
            chalk.yellowBright(
                "   - output: creates a '/versions' folder with two files: 'dependencies.json': the dependency tree database / 'raw_files': files reference database,' ."
            )
        )
        console.log(
            chalk.yellowBright(
                "- deps: 'Dependency Graph' creates the dependency tree for a component"
            )
        )
        console.log(
            chalk.yellowBright(
                "   - output: creates a mermaid flowchart reprensenting all the dependencies in the 'versions/relations/' folder"
            )
        )
        console.log(
            chalk.blackBright('mvers -p/-process = PROCESS '),
            chalk.blueBright(
                "-c/-component = componentName !works only with process:'deps'!"
            )
        )
        console.log(
            chalk.yellowBright(
                '   - note: yo can give the component name without extension (it will takes the first occurency), or the full or relevant part of the path in association with an extra parameter -sw/searchWhere '
            )
        )
        console.log(chalk.blueBright('-sw/searchWhere'))
        console.log(
            chalk.yellowBright(
                "  -values: 'name' = the strict component name. / 'fullName' = the strict full path with name and extension. / 'fullName.contains': relevant part of the path. "
            )
        )
        console.log(
            chalk.yellowBright(
                "- v-up: 'version up!' will create a new version of all the components dependency tree for the givent component. "
            )
        )
    }
    if (argv.p === 'build' || argv.process === 'build') {
        console.log(`executing build for: `, chalk.green(currentExecturingDir))
        build(currentExecturingDir)
    }
    if (argv.p === 'deps' || argv.process === 'deps') {
        if (!argv.c || !argv.component) {
            console.log(chalk.yellow('Please provide a component name'))
        } else {
            console.log(
                `executing dependency extract for: `,
                chalk.green(currentExecturingDir, argv.c, argv.sw)
            )
            getComponentDependencyChart(
                currentExecturingDir,
                argv.c,
                argv.sw,
                true
            )
        }
    }

    if (argv.p === 'v-up' || argv.process === 'v-up') {
        if (!argv.c || !argv.component) {
            console.log(chalk.yellow('Please provide a component name'))
            return
        }
        if (!argv.d || !argv.direction) {
            console.log(
                chalk.yellow(
                    'Please provide a direction up (new version) or down (downgrade version)'
                )
            )
            return
        }
        if (
            !['up', 'down'].includes(argv.d) ||
            !['up', 'down'].includes(argv.direction)
        ) {
            console.log(
                chalk.yellow(
                    'Unknown direction! please use only up (new version) or down (downgrade version)'
                )
            )
            return
        }
        console.log(
            `executing version ${argv.d} for: `,
            chalk.green(currentExecturingDir, argv.c, argv.sw, argv.d)
        )
        versionManager(currentExecturingDir, argv.c, argv.sw, argv.d)
    }

    if (argv.p === 'current-v' || argv.process === 'current-v') {
        if (!argv.c || !argv.component) {
            console.log(chalk.yellow('Please provide a component name'))
            return
        }

        getVersions(currentExecturingDir, argv.c, argv.sw)
    }

    if (argv.p === 'update' || argv.process === 'update') {
        if (!argv.c || !argv.component) {
            console.log(chalk.yellow('Please provide a component name'))
            return
        }
        if (!argv.y || !argv.y_vers) {
            console.log(
                chalk.yellow(
                    'Please provide a version (must exists in the reference version file)'
                )
            )
            return
        }

        console.log(
            `executing update files to: ${
                argv.y_vers ? argv.y_vers : 'latest'
            } for: `,
            chalk.green(
                currentExecturingDir,
                argv.c,
                argv.sw,
                argv.y_vers,
                argv.o
            )
        )
        updateFiles(currentExecturingDir, argv.c, argv.sw, argv.y, argv.o)
    }

    if (argv.p === 'clear' || argv.process === 'clear') {
        console.log(`executing clear files...`)
        clearFiles(currentExecturingDir)
    }

    if (argv.p === 'clear-v' || argv.process === 'clear-v') {
        if (!argv.c || !argv.component) {
            console.log(chalk.yellow('Please provide a component name'))
            return
        }
        if (!argv.y || !argv.y_vers) {
            console.log(
                chalk.yellow(
                    'Please provide a version (must exists in the reference version file)'
                )
            )
            return
        }
        console.log(`executing clear files...`)
        clearVersionsProjectFiles(currentExecturingDir, argv.c, argv.sw, argv.y)
    }
})
