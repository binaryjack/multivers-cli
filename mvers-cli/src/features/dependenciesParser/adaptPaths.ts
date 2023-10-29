import { IDependency } from '../../models/interop.js'

export const adaptPaths = (
    dependencies: IDependency[],
    currentTempPaths: string[],
    referencedVerison: string
) => {
    // prepare output collection
    let output: string[] = [...currentTempPaths]
    // get the component name  (usually is the last item of a dependency list)
    const dependencyComponentName = output[output.length - 1]
    // build the part of the path corresponding to the versionned component
    const versionnedNamePath = `${referencedVerison}\\${dependencyComponentName}.tsx`
    // try find the component in the dependecies file
    if (dependencies.find((o) => o.fullName.includes(versionnedNamePath))) {
        // if found the update the paths
        output = [
            ...output.slice(0, -1),
            referencedVerison,
            dependencyComponentName,
        ]
    }
    // return all
    return output
}
