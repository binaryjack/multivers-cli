import {
    IDependency,
    IDependencyVersion,
    IHierarchyDependency,
} from '../../models/interop.js'
import { InDb } from '../db/db.js'
import { saveVersions } from '../db/saveVersions.js'
import settings from '../settings.js'

/**
 * Prepares the next version for the component
 * @param flattenedTree IHierarchyDependency[]
 * @param foundComponent IDependency
 * @returns IDependencyVersion[]
 */
export const setVersionUp = (
    flattenedTree: IHierarchyDependency[],
    foundComponent: IDependency
): IDependencyVersion[] => {
    const { startingNewVersionFrom } = settings()

    const versionOutput: IDependencyVersion[] = []

    const { versions } = InDb()

    const componentVersions =
        versions.find((o) => o.componentFullName === foundComponent.fullName)
            ?.dependencies ?? []

    for (const f of flattenedTree) {
        //
        const existingVersion = componentVersions.find(
            (o) => o.fullName === f.component?.fullName
        )
        if (!existingVersion) {
            versionOutput.push({
                id: f.id,
                fullName: f.component?.fullName ?? '',
                versions: [startingNewVersionFrom],
            })
        } else {
            let next = startingNewVersionFrom
            if (existingVersion.versions?.length > 0) {
                next = Math.max(...existingVersion.versions.map((o) => o)) + 1
            }

            versionOutput.push({
                id: existingVersion.id,
                fullName: existingVersion.fullName,
                versions: [...existingVersion.versions, next],
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
