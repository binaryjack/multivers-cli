export interface IVersionExists {
    requestedVersion: number
    countVersions: number
    countRootFiles: number
}

export const checkIfExists = (
    filesRefs: string[],
    targetedVersion: number
): IVersionExists | undefined => {
    if (!Array.isArray(filesRefs)) return

    const noVersions = filesRefs.reduce((acc: [], currentItem) => {
        const contents = currentItem.existingVersions?.content
        if (!Array.isArray(acc)) {
            acc = []
        }
        /// takes only the version to produce
        if (!contents.find((o) => o.folder === `V${targetedVersion}`)) return []

        acc = acc.concat(contents)
        return acc
    }, {})

    const filesToCopy = filesRefs.reduce<[]>((acc: [], currentItem) => {
        const contents = currentItem.rootContents?.files
        if (!Array.isArray(acc)) {
            acc = []
        }
        acc = acc.concat(contents)
        return acc
    }, {})

    return {
        requestedVersion: 0,
        countVersions: noVersions.length,
        countRootFiles: filesToCopy.length,
    }
}
