import {
    IDependency,
    IFile,
    IFlatHierarchy,
    IVersion,
} from '../../models/interop.js'
import { fileManager } from '../filesManager/filesManager.js'
import {
    getComponentHierarchies,
    getVersionnedComponent,
} from '../stringParsers/init.js'

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

    const getVComponent = getVersionnedComponent(versions)
    const getFHierarchies = getComponentHierarchies(flatHierarchies)

    // will keep current version as backup
    return {
        files,
        versions,
        getVComponent,
        dependencies,
        flatHierarchies,
        getFHierarchies,
    }
}

//module.exports = { InDb }
