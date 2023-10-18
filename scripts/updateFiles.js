import fs from 'fs'
import InDb from './db.js'
import stringParsers from './stringParsers.js'
import fileManager from './fileManager.js'
import settings from './settings.js'
import arrayParser from './arrayParser.js'
import chalk from 'chalk'
import cliProgress from 'cli-progress'

const updateFiles = (
    root,
    component,
    searchWhere,
    version,
    overwrite = false
) => {
    global.rootDirectory = root
    const { replaceAll } = stringParsers()
    const { directoryName } = fileManager()
    const {
        buildVersionPath,
        buildPath,
        buildPathOffset,
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

export default updateFiles
