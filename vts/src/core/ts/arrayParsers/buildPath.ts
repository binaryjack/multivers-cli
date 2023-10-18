export const buildPath = (paths: string[]) => {
    if (paths?.length === 0) return ''
    return paths.join('\\')
}
