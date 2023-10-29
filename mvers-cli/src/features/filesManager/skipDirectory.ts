import settings from '../settings.js'

export const skipDirectory = (path: string) => {
    const { skipDirectories } = settings()
    for (const dName of skipDirectories) {
        if (path.includes(dName)) return true
    }
    return false
}
