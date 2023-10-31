import {
    IDependency,
    IDependencyGraph,
    IHierarchyDependency,
} from '../../models/interop.js'
import { InDb } from '../db/db.js'
import { saveFlatHierarchies } from '../db/saveFlatHierarchies.js'
import { newHierarchyDependency } from './newUniqueItem.js'

/**
 * Creates a flat lookup relation tree (relations parents <=> children)  representation for a component
 * @param tree IDependencyGraph[]
 * @param foundComponent IDependency
 * @returns IHierarchyDependency[]
 */
export const flattenTree = (
    tree: IDependencyGraph[],
    foundComponent: IDependency
): IHierarchyDependency[] => {
    const uniqueOutput: IHierarchyDependency[] = []

    const { flatHierarchies } = InDb()

    for (const b of tree) {
        const uniqueRoot = newHierarchyDependency()
        const uniqueDep = newHierarchyDependency()

        const existingRoot = uniqueOutput.find((o) => o.id === b.rootId)
        const existingDep = uniqueOutput.find((o) => o.id === b.depId)

        if (!existingRoot) {
            uniqueRoot.id = b.rootId
            uniqueRoot.component = b.root
            uniqueRoot.parents = []
            uniqueRoot.children = [b.depId]
            uniqueOutput.push(uniqueRoot)
        }

        if (existingRoot) {
            if (!existingRoot.children.find((o) => o === b.depId)) {
                existingRoot.children.push(b.depId)
            }
        }

        if (!existingDep) {
            uniqueDep.id = b.depId
            uniqueDep.component = b.dep
            uniqueDep.parents = [b.rootId]
            uniqueDep.children = []
            uniqueOutput.push(uniqueDep)
        }

        if (existingDep) {
            if (!existingDep.parents.find((o) => o === b.rootId)) {
                existingDep.parents.push(b.rootId)
            }
        }
    }
    const sortedOutput = uniqueOutput.sort((a, b) => a.id - b.id)

    const flatItem = flatHierarchies.find(
        (o) => o.componentFullName === foundComponent.fullName
    )
    if (!flatItem) {
        flatHierarchies.push({
            componentFullName: foundComponent.fullName,
            dependencies: sortedOutput,
        })
    } else {
        flatItem.dependencies = sortedOutput
    }
    saveFlatHierarchies(flatHierarchies)
    return sortedOutput
}
