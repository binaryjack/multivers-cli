import fs from 'fs'

import { countFilesInDirectory } from './countFilesInDirectory.js'
import { bakDependenciesKeyNameFactory } from './factories/bakDependenciesKeyNameFactory.js'
import { bakFilesKeyNameFactory } from './factories/bakFilesKeyNameFactory.js'
import { bakFlatHierarchyTreeKeyNameFactory } from './factories/bakFlatHierarchyTreeKeyNameFactory.js'
import { bakVersionsKeyNameFactory } from './factories/bakVersionsKeyNameFactory.js'
import { fileExists } from './fileExists.js'
import { getAllFiles } from './getAllFiles.js'
import { getAllFilesNoSkip } from './getAllFilesNoSkip.js'
import { loadFiles } from './loadFiles.js'
import { save } from './save.js'
import { skipDirectory } from './skipDirectory.js'

export const fileManager = () => {
    const baseDbDirectory = `${global.rootDirectory}\\versions`
    const backupDbDirectory = `${baseDbDirectory}\\bak`
    // working files
    const filesKeyName = `${baseDbDirectory}\\raw_files.json`
    const versionsKeyName = `${baseDbDirectory}\\files_versions.json`
    const dependenciesKeyName = `${baseDbDirectory}\\dependencies.json`
    const flatHierarchyTreeKeyName = `${baseDbDirectory}\\flathierarchytree.json`

    const bakVersionsKeyName = bakVersionsKeyNameFactory(backupDbDirectory)

    const bakFlatHierarchyTreeKeyName =
        bakFlatHierarchyTreeKeyNameFactory(backupDbDirectory)

    const bakFilesKeyName = bakFilesKeyNameFactory(backupDbDirectory)

    const bakDependenciesKeyName =
        bakDependenciesKeyNameFactory(backupDbDirectory)
    // backup : add /versions/bak/* to gitignore

    if (!fs.existsSync(baseDbDirectory)) {
        fs.mkdirSync(baseDbDirectory)
    }

    if (!fs.existsSync(backupDbDirectory)) {
        fs.mkdirSync(backupDbDirectory)
    }

    return {
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
