import {
    IDependency,
    IDependencyVersion,
    IHierarchyDependency,
} from '../../models/interop.js'
import { InDb } from '../db/db.js'
import { saveVersions } from '../db/saveVersions.js'

/**
 * Downgrades the latest version for the component
 * @param flattenedTree IHierarchyDependency[]
 * @param foundComponent IDependency
 * @returns IDependencyVersion[]
 */
export const setVersionDown = (
    flattenedTree: IHierarchyDependency[],
    foundComponent: IDependency
): IDependencyVersion[] => {
    const versionOutput: IDependencyVersion[] = []

    const { versions } = InDb()

    const componentVersions =
        versions.find((o) => o.componentFullName === foundComponent.fullName)
            ?.dependencies ?? []

    for (const f of flattenedTree) {
        const existingVersion = componentVersions.find(
            (o) => o.fullName === f?.component?.fullName
        )
        if (existingVersion) {
            versionOutput.push({
                id: existingVersion.id,
                fullName: existingVersion.fullName,
                versions: [
                    ...existingVersion.versions.slice(
                        0,
                        existingVersion.versions.length - 1
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
