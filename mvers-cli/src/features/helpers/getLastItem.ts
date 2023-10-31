/**
 * Gets the last item of an array
 * @param coll
 * @returns
 */
export const getLastItem = (coll: string[]): string | undefined => {
    return Array.isArray(coll) ? coll[coll.length - 1] : undefined
}
