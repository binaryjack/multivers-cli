/**
 * Builds the dependency path from array
 * @param paths
 * @returns string
 */
export const buildDependencyPath = (paths: string[]): string => {
    if (paths?.length === 0) return ''
    const output = []
    for (const dp of paths) {
        if (['.', '..'].includes(dp)) continue
        output.push(dp)
    }
    return `${output.join('\\')}.tsx`
}
