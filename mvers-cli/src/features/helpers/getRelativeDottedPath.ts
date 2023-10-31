/**
 * Gets the relative dotted path
 * @param count
 * @returns
 */
export const getRelativeDottedPath = (count: number): string[] => {
    const output: string[] = []
    for (let i = 0; i < count; i++) {
        output.push('..')
    }
    return output
}
