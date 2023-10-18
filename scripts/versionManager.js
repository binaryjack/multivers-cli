import InDb from './db.js'
import stringParsers from './stringParsers.js'
import fileManager from './fileManager.js'
import settings from './settings.js'
import dependencyBuilder from './dependencyBuilder.js'
const newUniqueItem = (
    id = 0,
    component = undefined,
    parents = [],
    childs = []
) => {
    return {
        id: id,
        component: component,
        parents: parents,
        childs: childs,
    }
}

const versionManager = (root, component, searchWhere, direction) => {
    global.rootDirectory = root
    const { statingNewVersionFrom } = settings()
    const {
        flatHierarchies,
        saveFlatHierarchies,
        getComponent,
        versions,
        saveVersions,
    } = InDb()
    // get the component
    const foundComponent = getComponent(component, searchWhere)
    if (!foundComponent) return

    // build the dependency tree
    const { dependencyTree, errors } = dependencyBuilder(foundComponent)

    const flattentree = (tree) => {
        const uniqueOutput = []
        for (const b of tree) {
            const uniqueRoot = newUniqueItem()
            const uniqueDep = newUniqueItem()

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
                if (!existingRoot.childs.find((o) => o.id === b.depId)) {
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
                if (!existingDep.parents.find((o) => o.id === b.rootId)) {
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
        saveFlatHierarchies()
        return sortedOutput
    }

    const setVersionUp = (flattenedTree) => {
        // id: id,
        // component: component,
        // parents: parents,
        // childs: childs,

        const versionOutput = []

        const componentVersions =
            versions.find(
                (o) => o.componentFullName === foundComponent.fullName
            )?.dependencies ?? []

        for (const f of flattenedTree) {
            //
            const existigVersion = componentVersions.find(
                (o) => o.fullName === f.component.fullName
            )
            if (!existigVersion) {
                versionOutput.push({
                    id: f.id,
                    fullName: f.component.fullName,
                    versions: [statingNewVersionFrom],
                })
            } else {
                let next = statingNewVersionFrom
                if (existigVersion.versions?.length > 0) {
                    next =
                        Math.max(...existigVersion.versions.map((o) => o)) + 1
                }

                versionOutput.push({
                    id: existigVersion.id,
                    fullName: existigVersion.fullName,
                    versions: [...existigVersion.versions, next],
                })
            }
        }

        const sortedOutput = versionOutput.sort((a, b) => a.id - b.id)

        const flatItem = versions.find(
            (o) => o.componentFullName === foundComponent.fullName
        )
        if (!flatItem) {
            versions.push({
                componentFullName: foundComponent.fullName,
                dependencies: sortedOutput,
            })
        } else {
            flatItem.dependencies = sortedOutput
        }
        saveVersions()
        return sortedOutput
    }

    const setVersionDown = (flattenedTree) => {
        // id: id,
        // component: component,
        // parents: parents,
        // childs: childs,

        const versionOutput = []

        const componentVersions =
            versions.find(
                (o) => o.componentFullName === foundComponent.fullName
            )?.dependencies ?? []

        for (const f of flattenedTree) {
            //
            const existigVersion = componentVersions.find(
                (o) => o.fullName === f.component.fullName
            )
            if (existigVersion) {
                versionOutput.push({
                    id: existigVersion.id,
                    fullName: existigVersion.fullName,
                    versions: [
                        ...existigVersion.versions.slice(
                            0,
                            existigVersion.versions.lastIndexOf()
                        ),
                    ],
                })
            }
        }

        const sortedOutput = versionOutput.sort((a, b) => a.id - b.id)

        const flatItem = versions.find(
            (o) => o.componentFullName === foundComponent.fullName
        )
        if (!flatItem) {
            versions.push({
                componentFullName: foundComponent.fullName,
                dependencies: sortedOutput,
            })
        } else {
            flatItem.dependencies = sortedOutput
        }
        saveVersions()
        return sortedOutput
    }

    const flattenedTree = flattentree(dependencyTree)
    direction === 'up'
        ? setVersionUp(flattenedTree)
        : setVersionDown(flattenedTree)
}

export default versionManager
