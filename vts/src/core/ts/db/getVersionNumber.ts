import { InDb } from './db.js'

export const getVersionNumber = (
    componentName: string,
    versionRequest: string
) => {
    const { versions } = InDb()

    const componentRef = versions.find(
        (o) => o.componentFullName === componentName
    )

    const existingVersionsNumbers =
        componentRef?.dependencies?.find((o) => o.id === 0)?.versions ?? []

    const requestedVersion =
        versionRequest === 'latest'
            ? existingVersionsNumbers[existingVersionsNumbers.length - 1]
            : existingVersionsNumbers.find(
                  (o) => o === parseInt(versionRequest)
              )

    return requestedVersion
}
