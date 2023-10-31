import settings from '../settings.js'

/**
 * Uses settings to skip a file
 * @param fileName
 * @returns
 */
export const skipFile = (fileName: string) => {
    const { skipFiles } = settings()
    for (const dName of skipFiles) {
        if (fileName.includes(dName)) return true
    }
    return false
}
