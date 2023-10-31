import settings from '../settings.js'

/**
 * Determines if the import is not a component import
 * @param imports string
 * @returns boolean
 */
export const isNotProjectImport = (imports: string): boolean => {
    const { notProjectImport } = settings()
    if (!imports) return false
    for (const e of notProjectImport) {
        if (imports.includes(e)) {
            return true
        }
    }
    return false
}
