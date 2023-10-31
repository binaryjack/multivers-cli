/**
 * Splits a strings using a separator
 * @param str string
 * @param separator string
 * @returns string[]
 */
export const splitAndTrim = (str: string, separator: string): string[] => {
    if (!str?.includes(separator)) return [str]
    const splitted = str.split(separator)
    const sanitizedOutput = []
    for (const s of splitted) {
        sanitizedOutput.push(s)
    }
    return sanitizedOutput
}
