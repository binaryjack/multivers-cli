import fs from 'fs'

import { localSettingsName } from './constants.js'

/**
 * This is the settings object.
 * Note: if a local setting file is found, it will replace this values during the tool usage.
 * @returns settings object
 */
const settings = (): {
    notProjectImport: string[]
    startingNewVersionFrom: number
    skipDirectories: string[]
    takeOnlyDirectories: string[]
    skipImportPaths: string[]
    skipFiles: string[]
} => {
    const settingsName = `${global.rootDirectory}\\${localSettingsName}`

    if (fs.existsSync(settingsName)) {
        return JSON.parse(fs.readFileSync(settingsName, 'utf-8'))
    }

    const startingNewVersionFrom: number = 2
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
    const skipFiles: string[] = [
        '.eslintrc.cjs',
        '.gitignore',
        'index.html',
        'mversconfig.json',
        'package-lock.json',
        'package.json',
        'README.md',
        'debug_sqli',
        'tsconfig.json',
        'tsconfig.node.json',
        'screenshots',
        'vite.config.ts',
        'vite-env.d.ts',
    ]
    const takeOnlyDirectories: string[] = ['src']

    return {
        notProjectImport,
        startingNewVersionFrom,
        skipDirectories,
        takeOnlyDirectories,
        skipImportPaths,
        skipFiles,
    }
}

export default settings
