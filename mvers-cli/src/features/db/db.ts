import {
    IDependency,
    IFile,
    IFlatHierarchy,
    IVersion,
} from '../../models/interop.js'
import { fileManager } from '../filesManager/filesManager.js'

export const InDb = () => {
    const {
        loadFiles,
        filesKeyName,
        versionsKeyName,
        dependenciesKeyName,
        flatHierarchyTreeKeyName,
    } = fileManager()

    let files: IFile[] = [...loadFiles(filesKeyName)]

    let versions: IVersion[] = [...loadFiles(versionsKeyName)]

    let dependencies: IDependency[] = [...loadFiles(dependenciesKeyName)]

    let flatHierarchies: IFlatHierarchy[] = [
        ...loadFiles(flatHierarchyTreeKeyName),
    ]

    // will keep current version as backup
    return {
        files,
        versions,
        dependencies,
        flatHierarchies,
    }
}

//module.exports = { InDb }
