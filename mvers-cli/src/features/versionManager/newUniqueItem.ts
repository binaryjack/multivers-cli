import { IDependency, IHierarchyDependency } from '../../models/interop.js'

/**
 * Create Hierarchy Dependency : IHierarchyDependency object
 * @param id number
 * @param component IDependency
 * @param parents number[]
 * @param children number[]
 * @returns IHierarchyDependency
 */
export const newHierarchyDependency = (
    id: number = 0,
    component?: IDependency,
    parents: number[] = [],
    children: number[] = []
): IHierarchyDependency => {
    return {
        id,
        component,
        parents,
        children,
    }
}
