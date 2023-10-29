import { setGlobalRoot } from '../../helpers/utils.js'
import { InDb } from '../db/db.js'
import { getComponent } from '../db/getComponent.js'
import { errMsg, infoMsg, warnMsg } from '../errors/helpers.js'

export const getVersions = (
    root: string,
    componentName: string,
    searchWhere: string
) => {
    setGlobalRoot(root)

    const { versions } = InDb()
    // get the component
    const foundComponent = getComponent(componentName, searchWhere)
    if (!foundComponent) {
        errMsg('getVersions', `No component found: ${componentName}`)
        return
    }

    const componentVersion = versions.find(
        (o) => o.componentFullName === foundComponent.fullName
    )
    if (!componentVersion) {
        errMsg(
            'getVersions',
            `Version file not found for ${foundComponent.file.name}`
        )
        return
    }

    const currentV = componentVersion.dependencies
        .map((o) => o.versions)
        .reduce((acc, currentItem) => {
            if (!Array.isArray(acc)) {
                acc = []
            }
            acc = [
                ...acc.filter((o) => !currentItem.includes(o)),
                ...currentItem,
            ]
            return acc
        })

    if (currentV?.length === 0) {
        warnMsg(
            'getVersions',
            `No versions found for ${foundComponent.file.name} `
        )
        return
    }

    infoMsg(
        'getVersions',
        `Current versions for: ${
            foundComponent.file.name
        } are:  ${currentV.join(', ')}`
    )
}
