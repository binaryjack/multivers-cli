export const buildPathLeftOffset = (paths: string[], offsetLeft: number) => {
    if (paths?.length === 0) return ''
    return paths.slice(offsetLeft).join('\\')
}
