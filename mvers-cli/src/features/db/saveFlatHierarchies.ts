import { IFlatHierarchy } from '../../models/interop.js'
import { fileManager } from '../filesManager/filesManager.js'
import { save } from '../filesManager/save.js'

export const saveFlatHierarchies = (flatHierarchies: IFlatHierarchy[]) => {
    const { flatHierarchyTreeKeyName, bakFlatHierarchyTreeKeyName } =
        fileManager()
    save(flatHierarchyTreeKeyName, bakFlatHierarchyTreeKeyName, flatHierarchies)
}
