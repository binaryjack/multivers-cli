export interface IFileParts {
    name: string
    extension: string
}

export interface IVersionExists {
    requestedVersion: number
    countVersions: number
    countRootFiles: number
}

export interface IExistingVersion {
    id: number
    fullName: string
    paths: string[]
    existingVersions: IVersionFolders
    rootContents: IVersionContent
}

export interface IImports {
    objects: string[]
    paths: string[]
}

export interface IFile {
    id: number
    file: IFileParts
    filePathFromSrc: string[]
    fullName: string
}

export interface IDependencyVersion {
    id: number
    fullName: string
    versions: number[]
}

export interface IDependency extends IFile {
    dependencies: IImports[]
}

export interface IVersion {
    componentFullName: string
    dependencies: IDependencyVersion[]
}

export interface IHierarchyDependency {
    id: number
    component?: IDependency
    // represents the IHierarchyDependency.ID of related parents
    parents: number[]
    // represents the IHierarchyDependency.ID of related children
    children: number[]
}

export interface IFlatHierarchy {
    componentFullName: string
    dependencies: IHierarchyDependency[]
}

export interface IDependencyTree {
    dependencyTree: IDependencyGraph[]
    errors: string[]
}

export interface IDependencyGraph {
    rootId: number
    depId: number
    root: IDependency
    dep: IDependency
}

export interface IVersionContent {
    folder: string
    files: string[]
}

export interface IVersionFolders {
    path: string
    content: IVersionContent[]
}

export interface IPrepareImportsToReplace {
    replaceBy: string
    originalImport?: string
    targetComponent: string
}
