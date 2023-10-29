import { IDependency } from '../../models/interop.js'
import { errMsg, infoMsg } from '../errors/helpers.js'
import { replaceAll } from '../stringParsers/replaceAll.js'
import { InDb } from './db.js'

export const getComponent = (
    componentName: string,
    searchWhere: string
): IDependency | undefined => {
    const { dependencies } = InDb()

    if (dependencies?.length === 0) {
        infoMsg('getComponent', 'dependencies are not set')
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
        errMsg(
            'getComponent',
            `This object doesn't exists: ", ${componentName}`
        )
        return undefined
    }
    infoMsg('getComponent', `Found object: ", ${foundComponent.fullName}`)
    return foundComponent
}
