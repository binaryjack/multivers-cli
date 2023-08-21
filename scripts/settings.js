const settings = () => {
    const statingNewVersionFrom = 2
    const notProjectImport = ['@', 'react', 'reportWebVitals']

    const commands = {
        applicationTitle: 'MULTIVERS',
        processes: {
            build: {
                name: 'build',
                help: '- build: "Dependency Database" creates the dependency database of the current project. as long as the projects has a src folder.',
                output: "   - output: creates a '/versions' folder with two files: 'dependencies.json': the dependency tree database / 'raw_files': files reference database,' .",
            },
            // build: {
            //     name: 'build',
            //     help: '- build: "Dependency Database" creates the dependency database of the current project. as long as the projects has a src folder.',
            // },
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
        commands,
    }
}
export default settings
//module.exports = { settings }
