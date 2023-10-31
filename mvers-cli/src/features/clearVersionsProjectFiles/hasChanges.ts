import fs from 'fs'

/**
 * Checks if both files has Changes
 * @param original string
 * @param versioned string
 * @returns boolean
 */
export const hasChanges = (original: string, versioned: string): boolean => {
    const originalContent = fs.readFileSync(original, 'utf-8')
    const versionedContent = fs.readFileSync(versioned, 'utf-8')

    const originalImports = originalContent
        .match(/(import.*from.'.*';?)|(import.*'.*';?)/gm)
        ?.join(' ')
        .replace(/\s?\r?\n?/gi, '')

    const versionedImports = versionedContent
        .match(/(import.*from.'.*';?)|(import.*'.*';?)/gm)
        ?.join(' ')
        .replace(/\s?\r?\n?/gi, '')

    const originalCleaned = originalContent
        .replace(/\s?\r?\n?/gi, '')
        .replace(originalImports!, '')
    const versionedCleaned = versionedContent
        .replace(/\s?\r?\n?/gi, '')
        .replace(versionedImports!, '')

    return originalCleaned !== versionedCleaned
}
