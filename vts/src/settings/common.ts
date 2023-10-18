import { TExtensions } from '../types/extensions.js'
import { EIFiles } from '../types/names.js'

const baseDbDirectory = (rootDir: string) => `${rootDir}\\IVersions`
const backupDbDirectory = (rootDir: string) => `${rootDir}\\bak`

const notProjectImport = ['@', 'react', 'reportWebVitals']
const statingNewIVersionFrom = 2

const IFileNames = (directory: string) => {
    const rawIFiles = (extension: TExtensions) => (stamp?: string) =>
        `${directory}\\${EIFiles.raw_IFiles}${
            stamp ? '.' : ''
        }${stamp}.${extension}`
    const IVersions = (extension: TExtensions) => (stamp?: string) =>
        `${directory}\\${EIFiles.IFiles_IVersions}${
            stamp ? '.' : ''
        }${stamp}.${extension}`
    const dependencies = (extension: TExtensions) => (stamp?: string) =>
        `${directory}\\${EIFiles.dependencies}${
            stamp ? '.' : ''
        }${stamp}.${extension}`
    const IFlatHierarchyTree = (extension: TExtensions) => (stamp?: string) =>
        `${directory}\\${EIFiles.IFlatHierarchyTree}${
            stamp ? '.' : ''
        }${stamp}.${extension}`

    return { rawIFiles, IVersions, dependencies, IFlatHierarchyTree }
}

const skipDirectories: string[] = [
    'node_modules',
    '.git',
    'IVersions',
    'testcafe',
    '.vscode',
    'public',
    'deploy_env_IFiles',
    'debug_sqli',
    'coverage',
    '.vs',
    'screenshots',
    'reporter',
]

export const common = (rootDirectory: string) => {
    const baseMversDir = baseDbDirectory(rootDirectory)
    const backupDirectory = backupDbDirectory(baseMversDir)

    const dbIFiles = {
        rawIFiles: IFileNames(baseMversDir).rawIFiles('json'),
        IVersions: IFileNames(baseMversDir).IVersions('json'),
        dependencies: IFileNames(baseMversDir).dependencies('json'),
        IFlatHierarchyTree: IFileNames(baseMversDir).IFlatHierarchyTree('json'),
    }

    const bakIFiles = {
        rawIFiles: IFileNames(backupDirectory).rawIFiles('bak'),
        IVersions: IFileNames(backupDirectory).IVersions('bak'),
        dependencies: IFileNames(backupDirectory).dependencies('bak'),
        IFlatHierarchyTree:
            IFileNames(backupDirectory).IFlatHierarchyTree('bak'),
    }

    return {
        dbIFiles,
        bakIFiles,
        skipDirectories,
        notProjectImport,
        statingNewIVersionFrom,
    }
}

export class Common {
    public _root: string = ''
    public common = common(this._root)
    constructor(root: string) {
        this._root = root
    }
}

const cl = new Common('C:')
