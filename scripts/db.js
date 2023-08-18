// const fmgr = require('./fileManager')
import fileManager from './fileManager.js'
import stringParsers from './stringParsers.js'
import chalk from 'chalk'

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
export default InDb
//module.exports = { InDb }
