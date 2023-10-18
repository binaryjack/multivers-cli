export interface FileRefs {
    directory: string
    files: string[]
}

export interface File {
    files: any
    folder: any
    name: string
    fullName: string
    pathOnly: string
    filePathFromSrc: string
}

export interface IError {
    message: string
}

export interface ExistingVersion {
    id: number
    fullName: string
    paths: string[]
    existingVersions: File[]
    rootContents: File
}

export interface OutputData {
    path: string
    content: ExistingVersion[]
}

export interface Imports {
    objects: string[]
    paths: string[]
}

export interface Component {
    id: number
    name: string
    root: Component
    rootId: number
    file: File
    depId: number
    dep: Component
    fullName: string
    directoryTrim: string
    filePathFromSrc: string
    dependencies: Component[]
    imports: Imports[]
    refs: any
    versions: number[]
}

export interface DependencyBranch {
    rootId: number
    depId: number
    root: Component
    dep: Component
}

export interface Global {
    rootDirectory: string
}

export interface Version {
    name: string
    componentFullName: string
    fullName: string

    dependencies: Component[]
}

export interface DependencyBuilderResult {
    dependencyTree: DependencyBranch[]
    errors: string[]
}

export interface FileImportDependency {
    file: File
    fullName: string
    filePathFromSrc: string
    dependencies: Imports[]
}

export interface Dependencies {
    component: Component
}

export interface FlatHierarchy {
    id: string
    componentFullName: string
    dependencies: Dependencies[]
}

export interface InDbProps {
    loadFiles: Function
    save: Function
    directoryName: string
    filesKeyName: string
    bakFilesKeyName: string
    versionsKeyName: string
    dependenciesKeyName: string
    bakDependenciesKeyName: string
    bakVersionsKeyName: string
    bakFlatHierarchyTreeKeyName: string
    flatHierarchyTreeKeyName: string
}

export interface UniqueItem {
    id: number
    component: any
    parents: number[]
    childs: number[]
}

export const newUniqueItem = (
    id: number = 0,
    component: any = undefined,
    parents: number[] = [],
    childs: number[] = []
): UniqueItem => {
    return {
        id: id,
        component: component,
        parents: parents,
        childs: childs,
    }
}

export interface FileManager {
    directoryName: string
    baseDbDirectory: string
    backupDbDirectory: string
    filesKeyName: string
    versionsKeyName: string
    dependenciesKeyName: string
    flatHierarchyTreeKeyName: string
    bakFilesKeyName: (stamp: string) => string
    bakVersionsKeyName: (stamp: string) => string
    bakDependenciesKeyName: (stamp: string) => string
    bakFlatHierarchyTreeKeyName: (stamp: string) => string
    loadFiles: (fileName: string) => any[]
    save: (
        fileName: string,
        backupfunction: (stamp: string) => string,
        data: any[]
    ) => void
    getAllFilesNoSkip: (directory: string, files?: string[]) => string[]
    getAllFiles: (directory: string, files?: string[]) => string[]
    countFilesInDirectory: (dirPath: string) => number
    skipDirectory: (path: string) => boolean
    fileExists: (path: string, fileName: string) => boolean
}

export interface ArrayParser {
    trimFromSrcDirectory: (directoriesArray: string[]) => string[]
    trimImportPath: (
        importString: string
    ) => { objects: string[]; paths: string[] } | undefined
    getLastItem: (coll: any[]) => any
    buildDependencyPath: (paths: string[]) => string
    buildPathOffset: (paths: string[], offsetRight: number) => string
    buildPath: (paths: string[]) => string
    buildVersionPath: (paths: string[], version: number) => string
    offsetPathRight: (path: string, offset: number) => string
    insertInPath: (path: string, where: number, what: string) => string
    mergePathToImport: (path: string, importsString: string) => string
}
