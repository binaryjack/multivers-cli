import { IImports } from '../arrayParsers/trimImportPath.js';
import { fileManager } from '../filesManager/filesManager.js';
import { IFileParts } from '../stringParsers/getExtension.js';

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
    // represents the IHierarchyDependency.ID of related childrens
    childs: number[]
}

export interface IFlatHierarchy {
    componentFullName: string
    dependencies: IHierarchyDependency[]
}


export interface IApplyVersion

id: number;
    fullName: string;
    paths: any;
    existingVersions: {
        path: string;
        content: {
            folder: string;
            files: string[];
        }[];
    };
    rootContents: {
        folder: string;
        files: string[];
    };












export const InDb = () => {
    const {
        loadFiles,
        directoryName,
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
        directoryName,
        files,
        versions,
        dependencies,
        flatHierarchies,
    }
}

//module.exports = { InDb }
