export const buildDependencyPath = (paths: string[]) => {
    if (paths?.length === 0) return ''
    const output = []
    for (const dp of paths) {
        if (['.', '..'].includes(dp)) continue
        output.push(dp)
    }
    return `${output.join('\\')}.tsx`
}
