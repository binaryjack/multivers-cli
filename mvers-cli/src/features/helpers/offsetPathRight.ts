/**
 * Gets the path with an offset from the right
 * @param path
 * @param offset
 * @returns
 */
export const offsetPathRight = (path: string, offset: number) => {
    if (!path?.includes('\\')) return path
    return path.split('\\').slice(0, offset).join('\\')
}
