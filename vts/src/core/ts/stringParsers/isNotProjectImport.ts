import settings from '../settings.js'

export const isNotProjectImport = (imports: string) => {
    const { notProjectImport } = settings()
    if (!imports) return false
    for (const e of notProjectImport) {
        if (imports.includes(e)) {
            return true
        }
    }
    return false
}
