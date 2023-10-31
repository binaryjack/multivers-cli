import settings from '../settings.js'

/**
 * Uses settings to skip directory
 * @param path
 * @returns
 */
export const skipDirectory = (path: string) => {
    const { skipDirectories } = settings()
    for (const dName of skipDirectories) {
        if (path.includes(dName)) return true
    }
    return false
}
