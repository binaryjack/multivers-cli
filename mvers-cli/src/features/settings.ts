const settings = (): {
    notProjectImport: string[]
    statingNewVersionFrom: number
    skipDirectories: string[]
    takeOnlyDirectories: string[]
    skipImportPaths: string[]
} => {
    const statingNewVersionFrom: number = 2
    const notProjectImport: string[] = ['@', 'react', 'reportWebVitals']
    const skipImportPaths: string[] = ['shared/components']
    const skipDirectories: string[] = [
        'node_modules',
        '.git',
        'versions',
        'testcafe',
        '.vscode',
        'public',
        'deploy_env_files',
        'debug_sqli',
        'coverage',
        '.vs',
        'screenshots',
        'reporter',
    ]
    const takeOnlyDirectories: string[] = ['src']

    return {
        notProjectImport,
        statingNewVersionFrom,
        skipDirectories,
        takeOnlyDirectories,
        skipImportPaths,
    }
}

export default settings
//module.exports = { settings }
