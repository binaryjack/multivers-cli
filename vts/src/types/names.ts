export type TDirectoryNames = 'IVersions' | 'bak'
export type TIFileNames =
    | 'raw_IFiles'
    | 'IFiles_IVersions'
    | 'dependencies'
    | 'IFlatHierarchyTree'

export enum EIFiles {
    raw_IFiles = 'raw_IFiles',
    IFiles_IVersions = 'IFiles_IVersions',
    dependencies = 'dependencies',
    IFlatHierarchyTree = 'IFlatHierarchyTree',
}

export enum EDirectories {
    IVersions = 'IVersions',
    bak = 'bak',
}
