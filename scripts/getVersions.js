import InDb from './db.js'
import chalk from 'chalk'

const getVersions = (root, component, searchWhere) => {
    global.rootDirectory = root

    const { getComponent, versions } = InDb()
    // get the component
    const foundComponent = getComponent(component, searchWhere)
    if (!foundComponent) {
        console.log(
            chalk.redBright(`No component found: ${foundComponent.file.name}`)
        )
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

    const currentV = componentVersion.dependencies.reduce(
        (acc, currentItem) => {
            if (!Array.isArray(acc)) {
                acc = []
            }
            acc = [
                ...acc.filter((o) => !currentItem.versions.includes(o)),
                ...currentItem.versions,
            ]
            return acc
        }
    )

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

export default getVersions
