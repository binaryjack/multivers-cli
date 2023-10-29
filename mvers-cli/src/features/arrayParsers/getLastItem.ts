export const getLastItem = (coll: string[]) => {
    return Array.isArray(coll) ? coll[coll.length - 1] : undefined
}
