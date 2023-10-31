/**
 * Build the path from array
 * @param paths
 * @returns
 */
export const buildPath = (paths: string[]): string => {
    if (paths?.length === 0) return ''
    return paths.join('\\')
}
