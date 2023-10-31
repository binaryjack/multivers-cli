import { IDependencyGraph } from '../../models/interop.js'
import { errMsg } from '../errors/helpers.js'

/**
 * gets the next ID
 * @param components
 * @param componentName
 * @param id
 * @returns
 */
export const nextId = (
    components: IDependencyGraph[],
    componentName: string,
    id: number
): number => {
    try {
        const root = components.find((o) => o.root.file.name === componentName)
        if (root) {
            // trace('nextId.found.root:', root.rootId)
            return root.rootId
        }
        const dep = components.find((o) => o.dep.file.name === componentName)
        if (dep) {
            // trace('nextId.found.dep:', dep.depId)
            return dep.depId
        }
        let outputId = id
        while (
            components.find(
                (o) => o.rootId === outputId || o.depId === outputId
            )
        ) {
            // trace('nextId increment:', outputId)

            outputId++
        }
        //trace('nextId output:', outputId)
        return outputId
    } catch (e: any) {
        errMsg(`nextId`, e.message)
        return -1
    }
}
