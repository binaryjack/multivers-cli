import { IFlatHierarchy, IVersion } from '../../models/interop.js'

export const asVersion = (version: number) => `V${version}`

export const getVersionnedComponent =
    (versions: IVersion[]) => (componentName: string) =>
        versions.find((o) => o.componentFullName === componentName)

export const getComponentHierarchies =
    (flatHierarchies: IFlatHierarchy[]) => (componentName: string) =>
        flatHierarchies.find((o) => o.componentFullName === componentName)
