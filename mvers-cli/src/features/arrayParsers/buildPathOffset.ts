export const buildPathOffset = (paths: string[], offsetRight: number) => {
    if (paths?.length === 0) return ''
    return paths.slice(0, -offsetRight).join('\\')
}

export const buildPathLeftOffset = (paths: string[], offsetLeft: number) => {
    if (paths?.length === 0) return ''
    return paths.slice(offsetLeft).join('\\')
}

export const getRelativeDottedPath = (count: number): string[] => {
    const output: string[] = []
    for (let i = 0; i < count; i++) {
        output.push('..')
    }
    return output
}
