export const trimFromSrcDirectory = (directoriesArray: string[]): string[] => {
    if (!Array.isArray(directoriesArray)) return []
    const output = []
    let start = false
    for (const d of directoriesArray) {
        if (d === 'src' || start) {
            output.push(d)
            start = true
        }
    }
    return output
}
