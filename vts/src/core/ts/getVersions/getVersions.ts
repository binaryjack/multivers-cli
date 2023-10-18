import chalk from 'chalk'

import { InDb } from '../db/db.js'
import { getComponent } from '../db/getComponent.js'

export const getVersions = (
    root: string,
    componentName: string,
    searchWhere: string
) => {
    global.rootDirectory = root

    const { versions } = InDb()
    // get the component
    const foundComponent = getComponent(componentName, searchWhere)
    if (!foundComponent) {
        console.log(chalk.redBright(`No component found: ${componentName}`))
        return
    }

    const componentVersion = versions.find(
        (o) => o.componentFullName === foundComponent.fullName
    )
    if (!componentVersion) {
        console.log(
            chalk.redBright(
                `Version file not found for ${foundComponent.file.name}`
            )
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
        console.log(
            chalk.yellowBright(
                `No versions found for ${foundComponent.file.name} `
            )
        )
        return
    }

    console.log(
        chalk.yellowBright(
            `Current versions for: ${
                foundComponent.file.name
            } are:  ${currentV.join(', ')}`
        )
    )
}
