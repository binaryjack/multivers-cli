import { IFlatHierarchy } from '../../models/interop.js'

/**
 * Gets the Components Hierarchies
 * @param flatHierarchies IFlatHierarchy[]
 * @returns  IFlatHierarchy[]
 */
export const getComponentHierarchies =
    (flatHierarchies: IFlatHierarchy[]) => (componentName: string) =>
        flatHierarchies.find((o) => o.componentFullName === componentName)
