import { IFile } from './db.js'

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
