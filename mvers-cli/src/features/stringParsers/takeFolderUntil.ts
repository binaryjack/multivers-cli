export const takeFolderUntil = (path: string, to: string) => {
    if (!path?.includes('\\')) return path
    if (!to) return path
    const output = []

    for (const f of path.split('\\')) {
        if (!f) continue
        output.push(f)
        if (f === to) return output.join('\\')
    }
}
