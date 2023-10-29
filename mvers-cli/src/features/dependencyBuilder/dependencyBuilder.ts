import { IDependency, IDependencyTree } from '../../models/interop.js'
import { getDependencies } from './getDependencies.js'

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
