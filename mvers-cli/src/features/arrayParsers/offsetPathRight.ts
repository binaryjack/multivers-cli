export const offsetPathRight = (path: string, offset: number) => {
    if (!path?.includes('\\')) return path
    return path.split('\\').slice(0, offset).join('\\')
}
