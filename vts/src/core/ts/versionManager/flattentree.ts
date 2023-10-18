import { IDependency, IHierarchyDependency } from '../db/db.js'
import InDb from '../db/index.js'
import { saveFlatHierarchies } from '../db/saveFlatHierarchies.js'
import { IDependencyGraph } from '../dependencyBuilder/getDependencies.js'
import { newHierarchyDependency } from './newUniqueItem.js'

export const flattentree = (
    tree: IDependencyGraph[],
    foundComponent: IDependency
) => {
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
            uniqueRoot.childs = [b.depId]
            uniqueOutput.push(uniqueRoot)
        }

        if (existingRoot) {
            if (!existingRoot.childs.find((o) => o === b.depId)) {
                existingRoot.childs.push(b.depId)
            }
        }

        if (!existingDep) {
            uniqueDep.id = b.depId
            uniqueDep.component = b.dep
            uniqueDep.parents = [b.rootId]
            uniqueDep.childs = []
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
