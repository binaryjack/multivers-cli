import { IDependency, IHierarchyDependency } from '../db/db.js'
import InDb from '../db/index.js'
import { saveVersions } from '../db/saveVersions.js'

export const setVersionDown = (
    flattenedTree: IHierarchyDependency[],
    foundComponent: IDependency
) => {
    // id: id,
    // component: component,
    // parents: parents,
    // childs: childs,

    const versionOutput = []

    const { versions } = InDb()

    const componentVersions =
        versions.find((o) => o.componentFullName === foundComponent.fullName)
            ?.dependencies ?? []

    for (const f of flattenedTree) {
        //
        const existigVersion = componentVersions.find(
            (o) => o.fullName === f?.component?.fullName
        )
        if (existigVersion) {
            versionOutput.push({
                id: existigVersion.id,
                fullName: existigVersion.fullName,
                versions: [
                    ...existigVersion.versions.slice(
                        0,
                        existigVersion.versions.length
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
    saveVersions(versions)
    return sortedOutput
}
