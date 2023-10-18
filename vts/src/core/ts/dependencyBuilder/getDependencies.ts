import { buildDependencyPath } from '../arrayParsers/buildDependencyPath.js'
import { IDependency, InDb } from '../db/db.js'
import { errorTrace } from './errorTrace.js'
import { nextId } from './nextId.js'

export interface IDependencyGraph {
    rootId: number
    depId: number
    root: IDependency
    dep: IDependency
}

export const getDependencies = (
    root: IDependency,
    rootId = -1,
    depId = 0,
    outputGraph: IDependencyGraph[] = []
) => {
    const { dependencies } = InDb()
    try {
        rootId = nextId(outputGraph, root.file.name, rootId + 1)

        if (!root.dependencies) return outputGraph
        for (const dependency of root.dependencies) {
            const dependencyPartialFullPath = buildDependencyPath(
                dependency.paths
            )
            if (dependencyPartialFullPath === '') continue

            const dep = dependencies.find((o) => {
                return o.fullName.includes(dependencyPartialFullPath)
            })

            if (dep) {
                depId = nextId(outputGraph, dep.file.name, depId + 1)

                if (
                    outputGraph.find(
                        (o) => o.rootId === rootId && o.depId === depId
                    )
                ) {
                    continue
                }
                outputGraph.push({
                    rootId: rootId,
                    depId: depId,
                    root: root,
                    dep: dep,
                })

                getDependencies(dep, rootId, depId, outputGraph)
            }
        }

        return outputGraph
    } catch (e: any) {
        errorTrace(`getDependencies.error: `, e.message)
    }
}
