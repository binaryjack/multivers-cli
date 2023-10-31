import { errMsg } from '../errors/helpers.js'
import { InDb } from './db.js'

/**
 * Gets the version number
 * @param componentName string
 * @param versionRequest string
 * @returns  number | undefined
 */
export const getVersionNumber = (
    componentName: string,
    versionRequest: string
): number | undefined => {
    const { versions } = InDb()

    const componentRef = versions.find(
        (o) => o.componentFullName === componentName
    )

    const existingVersionsNumbers =
        componentRef?.dependencies?.find((o) => o.id === 0)?.versions ?? []

    const requestedVersion =
        !versionRequest || versionRequest === 'latest'
            ? existingVersionsNumbers[existingVersionsNumbers.length - 1]
            : existingVersionsNumbers.find(
                  (o) => o === parseInt(versionRequest)
              )
    if (!requestedVersion) {
        errMsg(
            'getVersionNumber',
            `no version found for ${getVersionNumber} have you setted a version for this component with "v-up" command ? `
        )
    }
    return requestedVersion
}
