/**
 * Builds the path from an offset from the left
 * @param paths
 * @param offsetLeft //offset from left
 * @returns
 */
export const buildPathLeftOffset = (
    paths: string[],
    offsetLeft: number
): string => {
    if (paths?.length === 0) return ''
    return paths.slice(offsetLeft).join('\\')
}
