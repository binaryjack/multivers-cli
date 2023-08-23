import fs from 'fs'
import path from 'path'
import progress from './progress.js'
import settings from './settings.js'
import stringParsers from './stringParsers.js'
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
export default fileManager
//module.exports = { fileManager }
