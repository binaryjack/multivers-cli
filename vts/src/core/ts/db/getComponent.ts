import chalk from 'chalk'

import { replaceAll } from '../stringParsers/replaceAll.js'
import { IDependency, InDb } from './db.js'

export const getComponent = (
    componentName: string,
    searchWhere: string
): IDependency | undefined => {
    const { dependencies } = InDb()

    if (dependencies?.length === 0) {
        console.log('dependencies are not set')
        return undefined
    }

    const componentReformat = replaceAll(componentName, '/', '\\')
    const foundComponent = dependencies.find((o: IDependency) => {
        switch (searchWhere) {
            case 'name':
                return o.file.name === componentReformat
            case 'fullName.contains':
                return o.fullName.includes(componentReformat)
            case 'fullName':
                return o.fullName === componentReformat
        }
    })

    if (!foundComponent) {
        console.log(
            chalk.bgGreenBright(
                `This object doesn't exists: ", ${componentName}`
            )
        )
        return undefined
    }
    console.log(
        chalk.greenBright(`Found object: ", ${foundComponent.fullName}`)
    )

    return foundComponent
}
