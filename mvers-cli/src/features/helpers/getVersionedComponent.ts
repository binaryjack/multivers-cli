import { IVersion } from '../../models/interop.js'

/**
 * Factory: Gets the versioned component
 * @param versions  IVersion[] < Factory constructor
 * @param componentName: string usage function
 * @returns IVersion | undefined
 */
export const getVersionedComponent =
    (versions: IVersion[]) =>
    (componentName: string): IVersion | undefined =>
        versions.find((o) => o.componentFullName === componentName)
