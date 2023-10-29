export const buildVersionPath = (paths: string[], version: number) => {
    if (paths?.length === 0) return ''
    const output = [...paths, `V${version}`]

    return output.join('\\')
}
