import { IDependency } from '../db/db.js'
import { getDependencies, IDependencyGraph } from './getDependencies.js'

export interface IDependencyTree {
    dependencyTree: IDependencyGraph[]
    errors: string[]
}

export const dependencyBuilder = (component: IDependency): IDependencyTree => {
    const errors: string[] = []
    if (!component) {
        return {
            dependencyTree: [],
            errors: ['no component provided'],
        }
    }
    return {
        dependencyTree: getDependencies(component) ?? [],
        errors: errors,
    }
}
