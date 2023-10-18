import { fileManager } from '../filesManager/filesManager.js'
import { save } from '../filesManager/save.js'
import { IDependency } from './db.js'

export const saveDependencies = (dependencies: IDependency[]) => {
    const { dependenciesKeyName, bakDependenciesKeyName } = fileManager()
    save(dependenciesKeyName, bakDependenciesKeyName, dependencies)
}
