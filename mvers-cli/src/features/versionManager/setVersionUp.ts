import {
    IDependency,
    IDependencyVersion,
    IHierarchyDependency,
} from '../../models/interop.js'
import InDb from '../db/index.js'
import { saveVersions } from '../db/saveVersions.js'
import settings from '../settings.js'

export const setVersionUp = (
    flattenedTree: IHierarchyDependency[],
    foundComponent: IDependency
) => {
    // id: id,
    // component: component,
    // parents: parents,
    // childs: childs,

    const { statingNewVersionFrom } = settings()

    const versionOutput: IDependencyVersion[] = []

    const { versions } = InDb()
    // get the component

    const componentVersions =
        versions.find((o) => o.componentFullName === foundComponent.fullName)
            ?.dependencies ?? []

    for (const f of flattenedTree) {
        //
        const existigVersion = componentVersions.find(
            (o) => o.fullName === f.component?.fullName
        )
        if (!existigVersion) {
            versionOutput.push({
                id: f.id,
                fullName: f.component?.fullName ?? '',
                versions: [statingNewVersionFrom],
            })
        } else {
            let next = statingNewVersionFrom
            if (existigVersion.versions?.length > 0) {
                next = Math.max(...existigVersion.versions.map((o) => o)) + 1
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
    saveVersions(versions)
    return sortedOutput
}
