import { setGlobalRoot } from '../../helpers/utils.js'
import { getComponent } from '../db/getComponent.js'
import { dependencyBuilder } from '../dependencyBuilder/dependencyBuilder.js'
import { infoMsg } from '../errors/helpers.js'
import { flattenTree } from './flattenTree.js'
import { setVersionDown } from './setVersionDown.js'
import { setVersionUp } from './setVersionUp.js'

/**
 * Manages the up/down grade of the version
 * @param root  string
 * @param component string
 * @param searchWhere string
 * @param direction string
 * @returns void
 */
export const versionManager = (
    root: string,
    component: string,
    searchWhere: string,
    direction: string
) => {
    setGlobalRoot(root)

    const foundComponent = getComponent(component, searchWhere)
    if (!foundComponent) return

    const { dependencyTree } = dependencyBuilder(foundComponent)

    const flattenedTree = flattenTree(dependencyTree, foundComponent)
    direction === 'up'
        ? setVersionUp(flattenedTree, foundComponent)
        : setVersionDown(flattenedTree, foundComponent)

    infoMsg(
        'Version Up/Down has finished',
        `Process Complete: the version was ${direction}graded`
    )
}
