export const insertInPath = (path: string, where: number, what: string) => {
    if (!path?.includes('\\')) return path

    const pathParts = path.split('\\')

    return `${pathParts
        .slice(0, pathParts.length - where)
        .join('\\')}\\${what}\\${pathParts
        .slice(pathParts.length - where)
        .join('\\')}`
}
