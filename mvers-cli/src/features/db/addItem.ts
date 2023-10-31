import { IFile } from '../../models/interop.js'

/**
 * Append an item to a collection
 * @param collection
 * @param item
 */
export const addItem = (collection: IFile[], item: IFile) => {
    if (!collection) {
        collection = []
    }
    if (!collection.find((o) => o.fullName === item.fullName)) {
        collection.push(item)
    } else {
        collection = [
            ...collection.filter((o) => o.fullName !== item.fullName),
            item,
        ].sort((a: IFile, b: IFile) => a.file.name.localeCompare(b.file.name))
    }
}
