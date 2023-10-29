import { setGlobalRoot } from '../../helpers/utils.js'
import { getComponent } from '../db/getComponent.js'
import { dependencyBuilder } from '../dependencyBuilder/dependencyBuilder.js'
import { flattentree } from './flattentree.js'
import { setVersionDown } from './setVersionDown.js'
import { setVersionUp } from './setVersionUp.js'

export const versionManager = (
    root: string,
    component: string,
    searchWhere: string,
    direction: string
) => {
    setGlobalRoot(root)

    const foundComponent = getComponent(component, searchWhere)
    if (!foundComponent) return

    // build the dependency tree
    const { dependencyTree } = dependencyBuilder(foundComponent)

    const flattenedTree = flattentree(dependencyTree, foundComponent)
    direction === 'up'
        ? setVersionUp(flattenedTree, foundComponent)
        : setVersionDown(flattenedTree, foundComponent)
}
