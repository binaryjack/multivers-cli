import { IDependency, IHierarchyDependency } from '../../models/interop.js'

export const newHierarchyDependency = (
    id: number = 0,
    component?: IDependency,
    parents: number[] = [],
    childs: number[] = []
): IHierarchyDependency => {
    return {
        id,
        component,
        parents,
        childs,
    }
}
