import { IDependency } from '../../models/interop.js'
import { fileManager } from '../filesManager/filesManager.js'
import { save } from '../filesManager/save.js'

/**
 * Will save the dependency db file
 * @param dependencies
 */
export const saveDependencies = (dependencies: IDependency[]) => {
    const { dependenciesKeyName, bakDependenciesKeyName } = fileManager()
    save(dependenciesKeyName, bakDependenciesKeyName, dependencies)
}
