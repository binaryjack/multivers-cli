export const buildPathOffset = (paths: string[], offsetRight: number) => {
    if (paths?.length === 0) return ''
    return paths.slice(0, -offsetRight).join('\\')
}
