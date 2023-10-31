import { sanitize } from './sanitize.js'

/**
 * Collection of strings to clean
 * @param str
 * @returns string[]  then cleaned strings
 */
export const sanitizeCollection = (str: string[]): string[] => {
    if (!Array.isArray(str)) return []
    const toSanitize: string[] = []

    for (const s of str) {
        if (!s) continue

        if (s?.includes('/')) {
            toSanitize.push(...s.split('/'))
        } else {
            toSanitize.push(s)
        }
    }

    const sanitizedOutput = []

    for (const s of toSanitize) {
        const stm = sanitize(s)
        if (!stm) continue
        sanitizedOutput.push(stm)
    }
    return sanitizedOutput
}
