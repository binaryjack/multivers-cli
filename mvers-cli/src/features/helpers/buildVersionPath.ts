/**
 * Builds the path with the version TAG
 * @param paths
 * @param version
 * @returns
 */
export const buildVersionPath = (paths: string[], version: number): string => {
    if (paths?.length === 0) return ''
    const output = [...paths, `V${version}`]

    return output.join('\\')
}
