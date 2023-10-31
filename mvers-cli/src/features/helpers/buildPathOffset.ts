/**
 * Builds the path from an offset
 * @param paths
 * @param offsetRight
 * @returns
 */
export const buildPathOffset = (
    paths: string[],
    offsetRight: number
): string => {
    if (paths?.length === 0) return ''
    return paths.slice(0, -offsetRight).join('\\')
}
