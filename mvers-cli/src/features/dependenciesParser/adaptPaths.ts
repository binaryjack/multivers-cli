import { IDependency } from '../../models/interop.js'

/**
 * Will Adapt path into chunks string collection
 * @param dependencies
 * @param currentTempPaths
 * @param referencedVersion
 * @returns
 */
export const adaptPaths = (
    dependencies: IDependency[],
    currentTempPaths: string[],
    referencedVersion: string
) => {
    // prepare output collection
    let output: string[] = [...currentTempPaths]
    // get the component name  (usually is the last item of a dependency list)
    const dependencyComponentName = output[output.length - 1]
    // build the part of the path corresponding to the versioned component
    const versionedNamePath = `${referencedVersion}\\${dependencyComponentName}.tsx`
    // try find the component in the dependencies file
    if (dependencies.find((o) => o.fullName.includes(versionedNamePath))) {
        // if found the update the paths
        output = [
            ...output.slice(0, -1),
            referencedVersion,
            dependencyComponentName,
        ]
    }
    // return all
    return output
}
