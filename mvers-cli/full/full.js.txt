const settings = () => {
    const statingNewVersionFrom = 2
    const notProjectImport = ['@', 'react', 'reportWebVitals']
    const skipDirectories = [
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
    const takeOnlyDirectories = ['src']
    const coms = {
        applicationTitle: 'MVERS',
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
        coms,
        skipDirectories,
        takeOnlyDirectories,
    }
}
const stringParsers = () => {
    const { notProjectImport } = settings()

    const escapeRegExp = (str) => {
        return str?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
    }

    const replaceAll = (str, find, replace) => {
        if (!str) return ''
        return str?.replace(new RegExp(escapeRegExp(find), 'g'), replace)
    }

    const getExtension = (str) => {
        if (!str?.includes('.')) return { name: str, extension: '' }
        const nameParts = str.split('.')

        const extension = nameParts[nameParts.length - 1]
        const fileName = nameParts.slice(0, nameParts.length - 1).join('.')

        return { name: fileName, extension: extension }
    }

    const splitAndTrim = (str, separator) => {
        if (!str?.includes(separator)) return [str]
        const splitted = str.split(separator)
        const sanitizedOutput = []
        for (const s of splitted) {
            sanitizedOutput.push(s)
        }
        return sanitizedOutput
    }

    const sanitizeCollection = (str) => {
        if (!Array.isArray(str)) return []
        const toSanitize = []

        for (const s of str) {
            if (!s) continue

            if (s?.includes('/')) {
                toSanitize.push(...s.split('/'))
            } else {
                toSanitize.push(s)
            }
        }

        const sanitizedOutput = []

        for (const s of toSanitize) {
            const stm = sanitize(s)
            if (!stm) continue
            sanitizedOutput.push(stm)
        }
        return sanitizedOutput
    }

    const takeFolderUntil = (path, to) => {
        if (!path?.includes('\\')) return path
        if (!to) return path
        const output = []

        for (const f of path.split('\\')) {
            if (!f) continue
            output.push(f)
            if (f === to) return output.join('\\')
        }
    }

    const sanitize = (val) => {
        const pass1 = val.replaceAll('import', '')
        const pass2 = pass1.replaceAll(`'`, '')
        const pass3 = pass2.replaceAll(`;`, '')
        const pass4 = pass3.replaceAll(`,`, ' ')
        const pass5 = pass4.replaceAll(`}`, ' ')
        const pass6 = pass5.replaceAll(`{`, ' ')
        const pass7 = pass6.replaceAll(`/`, '')

        return pass7.trim()
    }

    const isNotProjectImport = (val) => {
        if (!val) return false
        for (const e of notProjectImport) {
            if (val.includes(e)) {
                return true
            }
        }
        return false
    }

    return {
        takeFolderUntil,
        getExtension,
        sanitizeCollection,
        replaceAll,
        sanitize,
        isNotProjectImport,
        splitAndTrim,
    }
}

const fileManager = () => {
    const { infinite } = progress()
    const { skipDirectories } = settings()
    const { replaceAll } = stringParsers()

    const directoryName = global.rootDirectory

    const baseDbDirectory = `${directoryName}\\versions`
    const backupDbDirectory = `${baseDbDirectory}\\bak`
    // working files
    const filesKeyName = `${baseDbDirectory}\\raw_files.json`
    const versionsKeyName = `${baseDbDirectory}\\files_versions.json`
    const dependenciesKeyName = `${baseDbDirectory}\\dependencies.json`
    const flatHierarchyTreeKeyName = `${baseDbDirectory}\\flathierarchytree.json`

    // backup : add /versions/bak/* to gitignore
    const bakFilesKeyName = (stamp) =>
        `${backupDbDirectory}\\raw_files.db.${stamp}.bak`

    const bakVersionsKeyName = (stamp) =>
        `${backupDbDirectory}\\files_versions.db.${stamp}.bak`

    const bakDependenciesKeyName = (stamp) =>
        `${backupDbDirectory}\\dependencies.db.${stamp}.bak`

    const bakFlatHierarchyTreeKeyName = (stamp) =>
        `${backupDbDirectory}\\flathierarchytree.db.${stamp}.bak`

    if (!fs.existsSync(baseDbDirectory)) {
        fs.mkdirSync(baseDbDirectory)
    }

    if (!fs.existsSync(backupDbDirectory)) {
        fs.mkdirSync(backupDbDirectory)
    }

    const loadFiles = (fileName) => {
        try {
            if (fs.existsSync(fileName)) {
                const data = fs.readFileSync(fileName)
                if (data) {
                    return JSON.parse(data)
                }
                return []
            }
        } catch (err) {
            console.log(err)
        }
        return []
    }

    const save = (fileName, backupfunction, data) => {
        try {
            const dte = new Date()
            const stamp = `${dte.getDate()}${dte.getHours()}${dte.getMinutes()}${dte.getMilliseconds()}`
            if (fs.existsSync(fileName)) {
                fs.renameSync(fileName, backupfunction(stamp))
            }
            if (fs.existsSync(fileName)) {
                fs.deleteSync(fileName)
            }
            fs.writeFileSync(fileName, JSON.stringify(data, null, 2))
        } catch (err) {
            console.log(err)
        }
    }

    const getAllFilesNoSkip = (directory, files = []) => {
        const filesInDirectory = fs.readdirSync(directory)
        infinite(directory)
        for (const file of filesInDirectory) {
            const absolute = path.join(directory, file)
            infinite(absolute)
            if (fs.statSync(absolute).isDirectory()) {
                getAllFiles(absolute, files)
            } else {
                files.push(absolute)
            }
        }
        return files
    }

    const getAllFiles = (directory, files = []) => {
        if (skipDirectory(directory)) return files
        const filesInDirectory = fs.readdirSync(directory)
        infinite(directory)
        for (const file of filesInDirectory) {
            const absolute = path.join(directory, file)
            infinite(absolute)
            if (fs.statSync(absolute).isDirectory()) {
                getAllFiles(absolute, files)
            } else {
                files.push(absolute)
            }
        }
        return files
    }

    const countFilesInDirectory = (dirPath) => {
        try {
            const files = getAllFiles(dirPath)
            return files.length
        } catch (err) {
            console.log(err)
        }
    }

    const skipDirectory = (path) => {
        for (const dName of skipDirectories) {
            if (path.includes(dName)) return true
        }
        return false
    }

    const fileExists = (path, fileName) => {
        try {
            const pathToSearch = replaceAll(
                `${directoryName}\\src\\${path}`,
                '/',
                '\\'
            )
            const files = getAllFilesNoSkip(pathToSearch)
            for (const f of files) {
                console.log(f)
            }
        } catch {
            return false
        }
    }

    return {
        // base directories
        directoryName,
        baseDbDirectory,
        backupDbDirectory,
        // files
        filesKeyName,
        versionsKeyName,
        dependenciesKeyName,
        flatHierarchyTreeKeyName,
        // backup
        bakFilesKeyName,
        bakVersionsKeyName,
        bakDependenciesKeyName,
        bakFlatHierarchyTreeKeyName,
        // loadder
        loadFiles,
        save,
        getAllFiles,

        countFilesInDirectory,

        skipDirectory,

        getAllFilesNoSkip,

        fileExists,
    }
}

const arrayParser = () => {
    const { fileExists } = fileManager()

    const { isNotProjectImport, splitAndTrim, sanitizeCollection, replaceAll } =
        stringParsers()

    const trimFromSrcDirectory = (directoriesArray) => {
        if (!Array.isArray(directoriesArray)) return ''
        const output = []
        let start = false
        for (const d of directoriesArray) {
            if (d === 'src' || start) {
                output.push(d)
                start = true
            }
        }
        return output
    }

    const trimImportPath = (importString) => {
        if (isNotProjectImport(importString)) return undefined
        const importSplitted = splitAndTrim(importString, 'from')
        const elements = splitAndTrim(importSplitted[0], ' ')
        const paths = splitAndTrim(importSplitted[1], '/')

        return {
            objects: sanitizeCollection(elements),
            paths: sanitizeCollection(paths),
        }
    }

    const getLastItem = (coll) => {
        return Array.isArray(coll) ? coll[coll.length - 1] : undefined
    }

    const buildDependencyPath = (paths) => {
        if (!paths?.length > 0) return ''
        const output = []
        for (const dp of paths) {
            if (['.', '..'].includes(dp)) continue
            output.push(dp)
        }
        return `${output.join('\\')}.tsx`
    }

    const buildPathOffset = (paths, offsetRight) => {
        if (!paths?.length > 0) return ''
        return paths.slice(0, -offsetRight).join('\\')
    }

    const buildPath = (paths) => {
        if (!paths?.length > 0) return ''
        return paths.join('\\')
    }

    const buildVersionPath = (paths, version) => {
        if (!paths?.length > 0) return ''
        const output = [...paths, `V${version}`]

        return output.join('\\')
    }

    const offsetPathRight = (path, offset) => {
        if (!path?.includes('\\')) return path
        return path.split('\\').slice(0, offset).join('\\')
    }

    const insertInPath = (path, where, what) => {
        if (!path?.includes('\\')) return path

        const pathParts = path.split('\\')

        return `${pathParts
            .slice(0, pathParts.length - where)
            .join('\\')}\\${what}\\${pathParts
            .slice(pathParts.length - where)
            .join('\\')}`
    }

    const mergePathToImport = (path, importsString) => {
        if (!importsString.includes(`'`)) return ''
        if (!importsString.includes(`/`)) return ''
        if (!path.includes(`\\`)) return ''

        let fromSplitted = importsString.split("'")[1].split('/')
        let pathSplitted = path.toString().split(`\\`)

        let isRelative = false
        let isRelativeToCurrentFolder = false
        if (fromSplitted[0] === '..') {
            fromSplitted = fromSplitted.slice(1)
            isRelative = true
        }

        let startFrom = ''

        if (fromSplitted[0] === '.') {
            fromSplitted = fromSplitted.slice(1)
            isRelativeToCurrentFolder = true

            startFrom = pathSplitted.lastIndexOf(fromSplitted[0])
        } else {
            startFrom = pathSplitted.indexOf(fromSplitted[0])
        }

        let target = pathSplitted.slice(startFrom).join('/').split('.')[0]

        let source = fromSplitted.join('/')

        if (isRelative) {
            source = `../${source}`
            target = `../../${target}`
        }

        if (isRelativeToCurrentFolder) {
            source = `./${source}`
            target = `./../${target}`
        }

        const fileName = fromSplitted[fromSplitted.length - 1]

        const sourceExists = fileExists(offsetPathRight(source, -1), fileName)
        const targetExists = fileExists(offsetPathRight(target, -1), fileName)

        return importsString.replace(source, target)
    }

    return {
        trimFromSrcDirectory,
        trimImportPath,
        getLastItem,
        buildDependencyPath,
        buildVersionPath,
        buildPath,
        buildPathOffset,
        offsetPathRight,
        insertInPath,
        mergePathToImport,
    }
}
const InDb = () => {
    const {
        loadFiles,
        save,
        directoryName,
        filesKeyName,
        bakFilesKeyName,
        versionsKeyName,
        dependenciesKeyName,
        bakDependenciesKeyName,
        bakVersionsKeyName,
        bakFlatHierarchyTreeKeyName,
        flatHierarchyTreeKeyName,
    } = fileManager()
    const { replaceAll } = stringParsers()
    // id
    // name: file,
    // directories: ['\\'].includes(path) ? path.split('\\') : [path],
    // fullName: `${path}\\${file}`,
    // pathOnly: path
    let files = [...loadFiles(filesKeyName)]

    // name: file,
    // fullName: `${path}\\${file}\\v2`,
    // version: 2
    let versions = [...loadFiles(versionsKeyName)]

    // name: file.name,
    // fullName: file.fullName,
    // directoryTrim: directoryTrim,
    // refs: refsCollection,
    let dependencies = [...loadFiles(dependenciesKeyName)]

    // id,
    // component
    let flatHierarchies = [...loadFiles(flatHierarchyTreeKeyName)]

    // will keep current version as backup

    const addItem = (collection, item) => {
        if (!collection) {
            collection = []
        }
        if (!collection.find((o) => o.fullName === item.fullName)) {
            collection.push(item)
        } else {
            collection = [
                ...collection.filter((o) => o.fullName !== item.fullName),
                item,
            ].sort((a, b) => a.name - b.name)
        }
    }

    const toHash = (str) => {
        if (str === '') return 0
        let hashString = 0
        for (let character of str) {
            let charCode = character.charCodeAt(0)
            hashString = hashString << (5 - hashString)
            hashString += charCode
            hashString |= hashString
        }
        return hashString
    }

    const saveFiles = () => {
        save(filesKeyName, bakFilesKeyName, files)
    }

    const saveDependencies = () => {
        save(dependenciesKeyName, bakDependenciesKeyName, dependencies)
    }

    const saveVersions = () => {
        save(versionsKeyName, bakVersionsKeyName, versions)
    }

    const saveFlatHierarchies = () => {
        save(
            flatHierarchyTreeKeyName,
            bakFlatHierarchyTreeKeyName,
            flatHierarchies
        )
    }

    const getComponent = (component, searchWhere) => {
        if (dependencies?.length === 0) {
            console.log('dependencies are not set')
            return undefined
        }

        const componentReformat = replaceAll(component, '/', '\\')
        const foundComponent = dependencies.find((o) => {
            switch (searchWhere) {
                case 'name':
                    return o.file.name === componentReformat
                case 'fullName.contains':
                    return o.fullName.includes(componentReformat)
                case 'fullName':
                    return o.fullName === componentReformat
            }
        })

        if (!foundComponent) {
            console.log(
                chalk.bgGreenBright(
                    `This object doesn't exists: ", ${component}`
                )
            )
            return undefined
        }
        console.log(
            chalk.greenBright(`Found object: ", ${foundComponent.fullName}`)
        )

        return foundComponent
    }

    const getVersionNumber = (component, versionRequest) => {
        const componentRef = versions.find(
            (o) => o.componentFullName === component
        )

        const existingVersionsNumbers = componentRef?.dependencies?.find(
            (o) => o.id === 0
        )?.versions

        const requestedVersion =
            versionRequest === 'latest'
                ? existingVersionsNumbers[existingVersionsNumbers.length - 1]
                : existingVersionsNumbers.find(
                      (o) => o === parseInt(versionRequest)
                  )

        return requestedVersion
    }

    return {
        getComponent,
        directoryName,
        toHash,
        addItem,
        saveFiles,
        saveDependencies,
        saveVersions,
        saveFlatHierarchies,
        files,
        versions,
        dependencies,
        flatHierarchies,
        getVersionNumber,
    }
}

const build = (startFolder) => {
    global.rootDirectory = startFolder

    console.log('build', global.rootDirectory)

    const { saveFiles, files, addItem, directoryName } = InDb()
    const { splitAndTrim, getExtension } = stringParsers()
    const { trimFromSrcDirectory } = arrayParser()
    const { countFilesInDirectory, skipDirectory } = filesManager()

    const count = countFilesInDirectory(startFolder)
    const { start, stop, incr, info } = progress()
    start(count)
    const recursFiles = (path, output = []) => {
        if (skipDirectory(path)) return output

        incr(path)

        const fileList = fs.readdirSync(path)
        for (const file of fileList) {
            incr(file)

            const currentFile = `${path}\\${file}`
            if (fs.statSync(currentFile).isDirectory()) {
                recursFiles(currentFile, output)
            } else {
                const splittedPath = splitAndTrim(path, '\\')
                const filePathFromSrc = trimFromSrcDirectory(splittedPath)
                const filePathWithFileName = [...filePathFromSrc, file]
                const fileDesc = {
                    id: output.length === 0 ? 0 : output.length + 1,
                    file: getExtension(file),
                    filePathFromSrc: filePathFromSrc,
                    fullName: filePathWithFileName.join('\\'),
                }
                output.push(fileDesc)
            }
        }
        return output
    }
    stop()
    const collectedFiles = recursFiles(directoryName)

    for (const file of collectedFiles) {
        addItem(files, file)
    }

    info('Process finished')

    saveFiles()
    dependenciesParser()
}

const dependenciesParser = () => {
    const { files, saveDependencies, dependencies, addItem } = InDb()
    const { trimImportPath } = arrayParser()
    const { directoryName } = fileManager()

    for (const file of files) {
        if (!file.fullName.toString().endsWith('.tsx')) {
            continue
        }
        const filewithPath = `${directoryName}\\${file.fullName}`
        const content = fs.readFileSync(filewithPath, 'utf8')

        const fileDependencies = content.match(
            /(import.*from.'.*';?)|(import.*'.*';?)/gm
        )

        const depCollection = []
        if (fileDependencies !== null) {
            for (const depItem of fileDependencies) {
                const depObject = trimImportPath(depItem)
                if (!depObject) continue
                depCollection.push(depObject)
            }
        }

        const dependency = {
            file: file.file,
            fullName: file.fullName,
            filePathFromSrc: file.filePathFromSrc,
            dependencies: depCollection,
        }
        addItem(dependencies, dependency)
    }
    saveDependencies()
}

const trace = (text, value) =>
    console.log(chalk.greenBright(`${text}, ${value}`))

const errorTrace = (text, value) => console.log(chalk.red(`${text}, ${value}`))
// gets the next ID
const nextId = (components, componentName, id) => {
    try {
        const root = components.find((o) => o.root.file.name === componentName)
        if (root) {
            // trace('nextId.found.root:', root.rootId)
            return root.rootId
        }
        const dep = components.find((o) => o.dep.file.name === componentName)
        if (dep) {
            // trace('nextId.found.dep:', dep.depId)
            return dep.depId
        }
        let outputId = id
        while (
            components.find(
                (o) => o.rootId === outputId || o.depId === outputId
            )
        ) {
            // trace('nextId increment:', outputId)

            outputId++
        }
        //trace('nextId output:', outputId)
        return outputId
    } catch (e) {
        errorTrace(`nextId.error: `, e.message)
    }
}
const dependencyBuilder = (component) => {
    const { dependencies } = InDb()
    const { buildDependencyPath } = arrayParser()

    let dependencyTree = []
    const errors = []

    if (!component) {
        return {
            dependencyTree: [],
            errors: ['no component provided'],
        }
    }

    const countDependencies = (r, count = 0) => {
        count += r?.dependencies?.length
        for (const c of r.dependencies) {
            if (c?.dependencies?.length > 0) {
                return countDependencies(c, count)
            }
        }
        return count
    }

    const max = countDependencies(component)

    const getDependencies = (
        root,
        rootId = -1,
        depId = 0,
        outputGraph = []
    ) => {
        try {
            rootId = nextId(outputGraph, root.file.name, rootId + 1)

            if (!root.dependencies) return outputGraph
            for (const dependency of root.dependencies) {
                const dependencyPartialFullPath = buildDependencyPath(
                    dependency.paths
                )
                if (dependencyPartialFullPath === '') continue

                const dep = dependencies.find((o) => {
                    return o.fullName.includes(dependencyPartialFullPath)
                })

                if (dep) {
                    depId = nextId(outputGraph, dep.file.name, depId + 1)

                    if (
                        outputGraph.find(
                            (o) => o.rootId === rootId && o.depId === depId
                        )
                    ) {
                        continue
                    }
                    outputGraph.push({
                        rootId: rootId,
                        depId: depId,
                        root: root,
                        dep: dep,
                    })

                    getDependencies(dep, rootId, depId, outputGraph)
                }
            }

            return outputGraph
        } catch (e) {
            errorTrace(`getDependencies.error: `, e.message)
        }
    }

    dependencyTree = getDependencies(component)

    return {
        dependencyTree: dependencyTree,
        errors: errors,
    }
}

const getComponentDependencyChart = (
    root,
    component,
    searchWhere,
    recursive = false
) => {
    global.rootDirectory = root

    const { replaceAll } = stringParsers()
    const { directoryName } = fileManager()
    const { getComponent } = InDb()

    // get the component
    const foundComponent = getComponent(component, searchWhere)
    if (!foundComponent) return

    // build the dependency tree
    const { dependencyTree, errors } = dependencyBuilder(foundComponent)

    // if recursive set do the same process for all the references
    if (recursive) {
        for (const d of dependencyTree) {
            getComponentDependencyChart(
                root,
                d.root.fullName,
                searchWhere,
                false
            )
            getComponentDependencyChart(
                root,
                d.dep.fullName,
                searchWhere,
                false
            )
        }
    }
    console.clear()
    console.log(chalk.greenBright(`Dependency process finished`))

    let outputList = dependencyTree
        .map((row) => {
            const leftId = row.rootId
            const rightId = row.depId
            console.log('')
            const rootElement = `${leftId}[${row.root.file.name}]`
            const dependencyElement = `${rightId}[${row.dep.file.name}]`

            const association = `${rootElement}--{${row.dep.fullName}}-->${dependencyElement}`

            const rootHtmlFileName = `${replaceAll(
                row.root.fullName,
                '\\',
                '_'
            )}.html`

            const dependencyHtmlFileName = `${replaceAll(
                row.dep.fullName,
                '\\',
                '_'
            )}.html`

            const clickRoot = `click ${leftId} "${rootHtmlFileName}" "navigate to ${row.root.file.name}"`
            const clickDependency = `click ${rightId} "${dependencyHtmlFileName}" "navigate to ${row.dep.file.name}"`

            return `${association}\r\n
                    ${clickRoot}\r\n
                    ${clickDependency}\r\n
            `
        })
        .join()

    const outputDirectoryName = `${directoryName}\\versions\\relations`
    const outputFileName = `${outputDirectoryName}\\${replaceAll(
        foundComponent.fullName,
        '\\',
        '_'
    )}.html`

    const output = `<!DOCTYPE html>
        <html lang="en">
          <body>
            <pre class="mermaid">
            flowchart LR
            ${replaceAll(outputList, ',', '\n')}
            </pre>
            <script type="module">
              import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
              let config = {  maxTextSize: 90000, startOnLoad: true, flowchart: { useMaxWidth: false, htmlLabels: true } };
              mermaid.initialize(config);
          
          
              </script>
          </body>
        </html>`

    if (!fs?.existsSync(outputDirectoryName)) {
        fs?.mkdirSync(outputDirectoryName)
    }

    if (fs?.existsSync(outputFileName)) {
        fs?.unlinkSync(outputFileName)
    }

    fs.writeFileSync(outputFileName, output, 'utf-8')
    console.clear()
    console.log(
        chalk.greenBright(
            `Process Complete - Output File: ", ${outputFileName}`
        )
    )
}

const getVersions = (root, component, searchWhere) => {
    global.rootDirectory = root

    const { getComponent, versions } = InDb()
    // get the component
    const foundComponent = getComponent(component, searchWhere)
    if (!foundComponent) {
        console.log(
            chalk.redBright(`No component found: ${foundComponent.file.name}`)
        )
        return
    }

    const componentVersion = versions.find(
        (o) => o.componentFullName === foundComponent.fullName
    )
    if (!componentVersion) {
        console.log(
            chalk.redBright(
                `Version file not found for ${foundComponent.file.name}`
            )
        )
        return
    }

    const currentV = componentVersion.dependencies.reduce(
        (acc, currentItem) => {
            if (!Array.isArray(acc)) {
                acc = []
            }
            acc = [
                ...acc.filter((o) => !currentItem.versions.includes(o)),
                ...currentItem.versions,
            ]
            return acc
        }
    )

    if (currentV?.length === 0) {
        console.log(
            chalk.yellowBright(
                `No versions found for ${foundComponent.file.name} `
            )
        )
        return
    }

    console.log(
        chalk.yellowBright(
            `Current versions for: ${
                foundComponent.file.name
            } are:  ${currentV.join(', ')}`
        )
    )
}

const progress = () => {
    const infiniteChars = ['--', '/', '|', '\\']
    let infiniteVar = 0

    let progressBar = new cliProgress.SingleBar()

    const start = (max) => {
        progressBar = new cliProgress.SingleBar({
            format:
                '{payload} |' +
                chalk.greenBright('{bar}') +
                '| {percentage}% || {value}/{total} Chunks ',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            linewrap: true,
            clearOnComplete: false,
            forceRedraw: true,
            hideCursor: true,
        })

        progressBar?.start(max, 0, {
            speed: 'N/A',
        })
    }

    const stop = () => {
        progressBar?.stop()
    }

    const incr = (payload) => {
        progressBar?.increment(1, { payload: payload })
    }

    const infinite = (text) => {
        infiniteVar++
        if (infiniteVar >= infiniteChars.length) {
            infiniteVar = 0
        }
        try {
            console.clear()
            console.info(
                chalk.blueBright(`${infiniteChars[infiniteVar]} ${text}`)
            )
        } catch {}
    }

    const info = (text) => {
        console.clear()
        console.log(chalk.blue(`${text}`))
    }

    return { start, stop, infinite, incr, info }
}

const updateFiles = (
    root,
    component,
    searchWhere,
    version,
    overwrite = false
) => {
    global.rootDirectory = root
    const { statingNewVersionFrom } = settings()
    const { replaceAll } = stringParsers()
    const { directoryName } = fileManager()
    const {
        buildVersionPath,
        buildPath,
        buildPathOffset,
        offsetPathRight,
        insertInPath,
        mergePathToImport,
    } = arrayParser()

    const { flatHierarchies, getComponent, versions, files, getVersionNumber } =
        InDb()
    // get the component
    const foundComponent = getComponent(component, searchWhere)
    if (!foundComponent) return

    const getVersionsFolderContents = (path) => {
        const versionDirectories = fs
            .readdirSync(path, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .filter((dirent) => /^V\d+$/.test(dirent.name))
            .map((dirent) => dirent.name)

        const output = []

        for (const f of versionDirectories) {
            const files = fs
                .readdirSync(path, { withFileTypes: true })
                .filter((dirent) => dirent.isFile())
                .map((dirent) => dirent.name)

            output.push({
                folder: f,
                files: files,
            })
        }

        return {
            path: path,
            content: output,
        }
    }

    const getRootFolderContents = (path) => {
        const files = fs
            .readdirSync(path, { withFileTypes: true })
            .filter((dirent) => dirent.isFile())
            .map((dirent) => dirent.name)

        return {
            folder: path,
            files: files,
        }
    }

    const requestedVersion = getVersionNumber(foundComponent.fullName, version)

    const getExistingVersion = (component) => {
        const existingVersion = []
        const componentRef = versions.find(
            (o) => o.componentFullName === component
        )

        const componentHierarchiesRef = flatHierarchies.find(
            (o) => o.componentFullName === component
        )

        for (const v of componentRef.dependencies) {
            const tmpComponent = componentHierarchiesRef.dependencies.find(
                (o) => o.component.fullName === v.fullName
            )

            if (!tmpComponent) continue

            const componentBasePath = buildPath(
                tmpComponent.component.filePathFromSrc
            )

            const existingItem = existingVersion.find((o) => {
                return o.fullName === componentBasePath
            })

            if (existingItem) continue

            const componentProjectPath = `${global.rootDirectory}\\${componentBasePath}`

            if (!componentProjectPath) {
                console.log('not exists ')
                continue
            }

            const existingVersionsFoldersAndContents =
                getVersionsFolderContents(componentProjectPath)
            const rootFolderContents =
                getRootFolderContents(componentProjectPath)

            existingVersion.push({
                id: tmpComponent.id,
                fullName: componentBasePath,
                paths: tmpComponent.filePathFromSrc,
                existingVersions: existingVersionsFoldersAndContents,
                rootContents: rootFolderContents,
            })
        }

        const sortedExistingVersion = existingVersion.sort(
            (a, b) => a.id - b.id
        )

        if (!fs?.existsSync(directoryName)) {
            console.log(
                chalk.red(
                    `ERROR: ", ${directoryName} does not exists please follow the usage instructions by typing mvers in the command line!`
                )
            )
            return []
        }

        const outputFileName = `${directoryName}\\versions\\${foundComponent.file.name}.json`
        if (fs?.existsSync(outputFileName)) {
            try {
                fs?.unlinkSync(outputFileName)
            } catch (e) {
                console.log(chalk.red(`ERROR: ", ${e.message}!`))
                return []
            }
        }

        fs.writeFileSync(
            outputFileName,
            JSON.stringify(sortedExistingVersion, null, 2)
        )

        return sortedExistingVersion
    }

    const checkIfExists = (filesRefs, targetedVersion) => {
        if (!Array.isArray(filesRefs)) return
        const noVersions = filesRefs.reduce((acc, currentItem) => {
            const contents = currentItem.existingVersions?.content
            if (!Array.isArray(acc)) {
                acc = []
            }
            /// takes only the version to produce
            if (!contents.find((o) => o.folder === `V${targetedVersion}`))
                return []

            acc = acc.concat(contents)
            return acc
        }, {})

        const filesToCopy = filesRefs.reduce((acc, currentItem) => {
            const contents = currentItem.rootContents?.files
            if (!Array.isArray(acc)) {
                acc = []
            }
            acc = acc.concat(contents)
            return acc
        }, {})

        return {
            requestedVersion: 0,
            countVersions: noVersions.length,
            countRootFiles: filesToCopy.length,
        }
    }

    const generateVersion = (filesCollection, requestedVersion, maxCount) => {
        if (
            !Array.isArray(filesCollection) ||
            !requestedVersion ||
            maxCount === 0
        )
            return

        const b1 = new cliProgress.SingleBar({
            format:
                'CLI Progress |' +
                chalk.greenBright('{bar}') +
                '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            forceRedraw: true,
            hideCursor: true,
        })

        const counters = filesCollection.reduce((acc, currentItem) => {
            const count = currentItem?.rootContents?.files?.length
            if (typeof acc === 'object') {
                acc = 0
            }

            return (acc = acc + count)
        }, {})

        b1.start((counters * filesCollection.length) / 100, 0, {
            speed: 'N/A',
        })

        const output = []

        let inc = 0
        for (const f of filesCollection) {
            const vFolderName = `${f.rootContents.folder}\\V${requestedVersion}`

            if (!fs?.existsSync(vFolderName)) {
                fs?.mkdirSync(vFolderName)
            }
            const newFileOutputVersion = {
                folder: vFolderName,
                files: [],
            }

            inc++
            b1.increment(inc, { payload: `=> ${vFolderName}` })

            for (const fToCopy of f.rootContents.files) {
                const originPath = `${f.rootContents.folder}\\${fToCopy}`
                const targetPath = `${vFolderName}\\${fToCopy}`

                if (overwrite) {
                    if (fs?.existsSync(targetPath)) {
                        try {
                            fs?.unlinkSync(targetPath)
                        } catch (e) {
                            console.log(
                                chalk.red(
                                    `ERROR: ", ${e.message}! cannot delete ${targetPath}`
                                )
                            )
                        }
                    }
                }
                if (!fs?.existsSync(targetPath)) {
                    fs?.copyFileSync(originPath, targetPath)
                }
                newFileOutputVersion.files.push(targetPath)
            }
            output.push(newFileOutputVersion)
        }
        b1.stop()

        return output
    }

    const outputData = getExistingVersion(foundComponent.fullName)

    const outputCounts = checkIfExists(outputData, requestedVersion)
    if (outputCounts.countVersions > 0 && !overwrite) {
        console.log(
            chalk.red(
                `ERROR: ", the versions files already exists. By default you cannot overwrite them, if you want to force the process you can add the -overwite parameter`
            )
        )
        return
    }
    if (outputCounts.countRootFiles === 0) {
        console.log(
            chalk.yellow(
                `WARNING: ", there is no files in the target directories `
            )
        )
        return
    }

    const generatedVersion = generateVersion(
        outputData,
        requestedVersion,
        outputCounts.countRootFiles
    )

    const gv = generatedVersion

    const redoExsitingProcess = getExistingVersion(foundComponent.fullName)

    const updateImports = (uniqueFileList, component, version) => {
        const existingVersion = []
        const componentRef = versions.find(
            (o) => o.componentFullName === component
        )
        const errors = []
        const componentHierarchiesRef = flatHierarchies.find(
            (o) => o.componentFullName === component
        )

        const versionName = `V${version}`

        for (const dep of componentHierarchiesRef.dependencies) {
            const currentComponent = dep.component
            const componentPath = `${global.rootDirectory}\\${buildVersionPath(
                currentComponent.filePathFromSrc,
                version
            )}\\${currentComponent.file.name}.${
                currentComponent.file.extension
            }`

            const rootComponentPathOffset = buildPathOffset(
                currentComponent.filePathFromSrc,
                1
            )

            let content = fs.readFileSync(componentPath, 'utf8')
            const fileDependencies = content.match(
                /(import.*from.'.*';?)|(import.*'.*';?)/gm
            )

            const references = []

            for (const cDep of currentComponent.dependencies) {
                if (cDep?.paths?.length === 0) continue

                const path = ['.', '..'].includes(cDep.paths[0])
                    ? buildPath(cDep.paths.slice(1))
                    : buildPath(cDep.paths)

                if (path === '') continue

                const rawFile = files.find((o) => o.fullName.includes(path))

                if (!rawFile) {
                    console.log('not found', path)
                    continue
                }
                // Import present in the ccomponent file
                const currentImportPath = fileDependencies.find((o) =>
                    o.includes(replaceAll(path, '\\', '/'))
                )

                // try find the version ### file
                const pathVersion = insertInPath(
                    rawFile.fullName,
                    1,
                    versionName
                )

                const fullPath = `${global.rootDirectory}\\${pathVersion}`

                if (fs.existsSync(fullPath)) {
                    references.push({
                        path: fullPath,
                        import: currentImportPath,
                    })
                }
            }

            for (const r of references) {
                const originalImport = r.import
                const replaceBy = mergePathToImport(r.path, r.import)
                content = content.replace(originalImport, replaceBy)
            }

            fs.writeFileSync(componentPath, content, 'utf8')
        }
    }

    updateImports(
        redoExsitingProcess,
        foundComponent.fullName,
        requestedVersion
    )
}

const newUniqueItem = (
    id = 0,
    component = undefined,
    parents = [],
    childs = []
) => {
    return {
        id: id,
        component: component,
        parents: parents,
        childs: childs,
    }
}

const versionManager = (root, component, searchWhere, direction) => {
    global.rootDirectory = root
    const { statingNewVersionFrom } = settings()
    const { replaceAll } = stringParsers()
    const { directoryName } = fileManager()
    const {
        flatHierarchies,
        saveFlatHierarchies,
        getComponent,
        versions,
        saveVersions,
    } = InDb()
    // get the component
    const foundComponent = getComponent(component, searchWhere)
    if (!foundComponent) return

    // build the dependency tree
    const { dependencyTree, errors } = dependencyBuilder(foundComponent)

    const flattentree = (tree) => {
        const uniqueOutput = []
        for (const b of tree) {
            const uniqueRoot = newUniqueItem()
            const uniqueDep = newUniqueItem()

            const existingRoot = uniqueOutput.find((o) => o.id === b.rootId)
            const existingDep = uniqueOutput.find((o) => o.id === b.depId)

            if (!existingRoot) {
                uniqueRoot.id = b.rootId
                uniqueRoot.component = b.root
                uniqueRoot.parents = []
                uniqueRoot.childs = [b.depId]
                uniqueOutput.push(uniqueRoot)
            }

            if (existingRoot) {
                if (!existingRoot.childs.find((o) => o.id === b.depId)) {
                    existingRoot.childs.push(b.depId)
                }
            }

            if (!existingDep) {
                uniqueDep.id = b.depId
                uniqueDep.component = b.dep
                uniqueDep.parents = [b.rootId]
                uniqueDep.childs = []
                uniqueOutput.push(uniqueDep)
            }

            if (existingDep) {
                if (!existingDep.parents.find((o) => o.id === b.rootId)) {
                    existingDep.parents.push(b.rootId)
                }
            }
        }
        const sortedOutput = uniqueOutput.sort((a, b) => a.id - b.id)

        const flatItem = flatHierarchies.find(
            (o) => o.componentFullName === foundComponent.fullName
        )
        if (!flatItem) {
            flatHierarchies.push({
                componentFullName: foundComponent.fullName,
                dependencies: sortedOutput,
            })
        } else {
            flatItem.dependencies = sortedOutput
        }
        saveFlatHierarchies()
        return sortedOutput
    }

    const setVersionUp = (flattenedTree) => {
        // id: id,
        // component: component,
        // parents: parents,
        // childs: childs,

        const versionOutput = []

        const componentVersions =
            versions.find(
                (o) => o.componentFullName === foundComponent.fullName
            )?.dependencies ?? []

        for (const f of flattenedTree) {
            //
            const existigVersion = componentVersions.find(
                (o) => o.fullName === f.component.fullName
            )
            if (!existigVersion) {
                versionOutput.push({
                    id: f.id,
                    fullName: f.component.fullName,
                    versions: [statingNewVersionFrom],
                })
            } else {
                let next = statingNewVersionFrom
                if (existigVersion.versions?.length > 0) {
                    next =
                        Math.max(...existigVersion.versions.map((o) => o)) + 1
                }

                versionOutput.push({
                    id: existigVersion.id,
                    fullName: existigVersion.fullName,
                    versions: [...existigVersion.versions, next],
                })
            }
        }

        const sortedOutput = versionOutput.sort((a, b) => a.id - b.id)

        const flatItem = versions.find(
            (o) => o.componentFullName === foundComponent.fullName
        )
        if (!flatItem) {
            versions.push({
                componentFullName: foundComponent.fullName,
                dependencies: sortedOutput,
            })
        } else {
            flatItem.dependencies = sortedOutput
        }
        saveVersions()
        return sortedOutput
    }

    const setVersionDown = (flattenedTree) => {
        // id: id,
        // component: component,
        // parents: parents,
        // childs: childs,

        const versionOutput = []

        const componentVersions =
            versions.find(
                (o) => o.componentFullName === foundComponent.fullName
            )?.dependencies ?? []

        for (const f of flattenedTree) {
            //
            const existigVersion = componentVersions.find(
                (o) => o.fullName === f.component.fullName
            )
            if (existigVersion) {
                versionOutput.push({
                    id: existigVersion.id,
                    fullName: existigVersion.fullName,
                    versions: [
                        ...existigVersion.versions.slice(
                            0,
                            existigVersion.versions.lastIndexOf()
                        ),
                    ],
                })
            }
        }

        const sortedOutput = versionOutput.sort((a, b) => a.id - b.id)

        const flatItem = versions.find(
            (o) => o.componentFullName === foundComponent.fullName
        )
        if (!flatItem) {
            versions.push({
                componentFullName: foundComponent.fullName,
                dependencies: sortedOutput,
            })
        } else {
            flatItem.dependencies = sortedOutput
        }
        saveVersions()
        return sortedOutput
    }

    const flattenedTree = flattentree(dependencyTree)
    direction === 'up'
        ? setVersionUp(flattenedTree)
        : setVersionDown(flattenedTree)
}

const clearFiles = (root) => {
    global.rootDirectory = root

    const { baseDbDirectory, getAllFilesNoSkip } = fileManager()

    const clearAll = async (folder) => {
        const ok = await yesno({
            question:
                'This will remove all files and versions but not the project files produced with it, continue?',
            invalid: function ({
                question,
                defaultValue,
                yesValues,
                noValues,
            }) {
                process.stdout.write('\n Process aborted')
                process.exit(1)
            },
        })

        const files = getAllFilesNoSkip(folder)
        const filesCount = files.length

        const { start, stop, incr } = progress()
        start(filesCount)
        const deletedFiles = []

        for (const f of files) {
            incr(`deleting => ${f}`)

            if (fs?.existsSync(f)) {
                try {
                    fs?.unlinkSync(f)
                    deletedFiles.push(f)
                } catch (e) {
                    console.log(
                        chalk.red(`ERROR: ", ${e.message}! cannot delete ${f}`)
                    )
                }
            }
        }
        stop()
        if (deletedFiles.length === filesCount)
            fs.rmSync(folder, { recursive: true, force: true })
    }

    clearAll(baseDbDirectory)
}

const clearVersionsProjectFiles = (root, component, searchWhere, version) => {
    global.rootDirectory = root
    const { statingNewVersionFrom } = settings()
    const { replaceAll } = stringParsers()
    const { directoryName } = fileManager()
    const { buildVersionPath, buildPath } = arrayParser()

    const { flatHierarchies, getComponent, versions, getVersionNumber } = InDb()
    // get the component
    const foundComponent = getComponent(component, searchWhere)
    if (!foundComponent) return

    const requestedVersion = getVersionNumber(foundComponent.fullName, version)

    const clearVersion = (component, version) => {
        const componentRef = versions.find(
            (o) => o.componentFullName === component
        )

        const componentHierarchiesRef = flatHierarchies.find(
            (o) => o.componentFullName === component
        )

        const versionFolderName = `V${version}`

        for (const v of componentRef.dependencies) {
            const tmpComponent = componentHierarchiesRef.dependencies.find(
                (o) => o.component.fullName === v.fullName
            )

            if (!tmpComponent) continue

            const componentBasePath = buildPath(
                tmpComponent.component.filePathFromSrc
            )

            const versionFolder = `${global.rootDirectory}\\${componentBasePath}\\${versionFolderName}`
            if (fs?.existsSync(versionFolder)) {
                try {
                    fs?.rmSync(versionFolder, { recursive: true, force: true })
                } catch (e) {
                    console.log(chalk.red(`ERROR: ", ${e.message}!`))
                    return []
                }
            }
        }
    }

    clearVersion(foundComponent.fullName, requestedVersion)
}
