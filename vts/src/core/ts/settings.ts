const settings = (): {
    notProjectImport: string[]
    statingNewVersionFrom: number
    coms: {
        applicationTitle: string
        processes: {
            build: {
                name: string
                help: string
                output: string
            }
        }
        parameters: {
            p: {
                name: string
                alias: string
                describe: string
                help: string
                type: string
                default: string
                demandOption: boolean
            }
            c: {
                name: string
                alias: string
                describe: string
                help: string
                type: string
                default: string
                demandOption: boolean
            }
            sw: {
                name: string
                alias: string
                describe: string
                help: string
                type: string
                default: string
                demandOption: boolean
            }
            d: {
                name: string
                alias: string
                describe: string
                help: string
                type: string
                default: string
                demandOption: boolean
            }
            y: {
                name: string
                alias: string
                describe: string
                help: string
                type: string
                default: string
                demandOption: boolean
            }
            o: {
                name: string
                alias: string
                describe: string
                help: string
                type: string
                default: boolean
                demandOption: boolean
            }
        }
    }
    skipDirectories: string[]
    takeOnlyDirectories: string[]
} => {
    const statingNewVersionFrom: number = 2
    const notProjectImport: string[] = ['@', 'react', 'reportWebVitals']
    const skipDirectories: string[] = [
        'node_modules',
        '.git',
        'versions',
        'testcafe',
        '.vscode',
        'public',
        'deploy_env_files',
        'debug_sqli',
        'coverage',
        '.vs',
        'screenshots',
        'reporter',
    ]
    const takeOnlyDirectories: string[] = ['src']
    const coms = {
        applicationTitle: 'MVERS',
        processes: {
            build: {
                name: 'build',
                help: '- build: "Dependency Database" creates the dependency database of the current project. as long as the projects has a src folder.',
                output: "   - output: creates a '/versions' folder with two files: 'dependencies.json': the dependency tree database / 'raw_files': files reference database,' .",
            },
        },
        parameters: {
            p: {
                name: 'p',
                alias: 'process',
                describe: 'process to execute',
                help: '',
                type: 'string',
                default: '',
                demandOption: true,
            },
            c: {
                name: 'c',
                alias: 'component',
                describe: 'The root component you want to version',
                help: '',
                type: 'string',
                default: '',
                demandOption: false,
            },
            sw: {
                name: 'sw',
                alias: 'searchWhere',
                describe:
                    'search where : in name (component name: takes the first occurency)/ in fullName (full component path)',
                help: '',
                type: 'string',
                default: 'fullName.contains',
                demandOption: false,
            },
            d: {
                name: 'd',
                alias: 'direction',
                describe:
                    'direction mode : up / down the version. Note! It will only prepare the version reference file it will also try to grab the existings physical folders versions previousely done with this tool.',
                help: '',
                type: 'string',
                default: 'up',
                demandOption: false,
            },
            y: {
                name: 'y',
                alias: 'yersion',
                describe:
                    'version: "latest" = default,  or the version number prepared with process "v-up"',
                help: '',
                type: 'string',
                default: 'latest',
                demandOption: false,
            },
            o: {
                name: 'o',
                alias: 'overwrite',
                describe: 'overwrite file',
                help: '',
                type: 'boolean',
                default: false,
                demandOption: false,
            },
        },
    }

    return {
        notProjectImport,
        statingNewVersionFrom,
        coms,
        skipDirectories,
        takeOnlyDirectories,
    }
}

export default settings
//module.exports = { settings }
