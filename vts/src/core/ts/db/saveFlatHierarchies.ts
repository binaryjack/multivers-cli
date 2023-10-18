import { fileManager } from '../filesManager/filesManager.js'
import { save } from '../filesManager/save.js'
import { IFlatHierarchy } from './db.js'

export const saveFlatHierarchies = (flatHierarchies: IFlatHierarchy[]) => {
    const { flatHierarchyTreeKeyName, bakFlatHierarchyTreeKeyName } =
        fileManager()
    save(flatHierarchyTreeKeyName, bakFlatHierarchyTreeKeyName, flatHierarchies)
}
