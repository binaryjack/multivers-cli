import {
    IExistingVersion,
    IVersionContent,
    IVersionExists,
} from '../../models/interop.js'

/**
 * Check if prepared version files exists (will not check the physical files yet)
 * @param filesRefs IExistingVersion[]
 * @param targetedVersion number
 * @returns IVersionExists | undefined
 */
export const checkIfExists = (
    filesRefs: IExistingVersion[],
    targetedVersion: number
): IVersionExists | undefined => {
    if (!Array.isArray(filesRefs)) return

    const noVersions = filesRefs.reduce<IVersionContent[]>(
        (acc, currentItem) => {
            const contents = currentItem.existingVersions.content
            if (!Array.isArray(acc)) {
                acc = []
            }
            /// takes only the version to produce
            if (!contents.find((o) => o.folder === `V${targetedVersion}`))
                return []

            acc = acc.concat(contents)
            return acc
        },
        []
    )

    const filesToCopy = filesRefs.reduce<string[]>((acc, currentItem) => {
        const contents = currentItem.rootContents?.files
        if (!Array.isArray(acc)) {
            acc = []
        }
        acc = acc.concat(contents)
        return acc
    }, [])

    return {
        requestedVersion: 0,
        countVersions: noVersions.length,
        countRootFiles: filesToCopy.length,
    }
}
