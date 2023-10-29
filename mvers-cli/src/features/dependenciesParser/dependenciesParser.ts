import fs from 'fs'

import { IDependency, IImports } from '../../models/interop.js'
import arrayParser from '../arrayParsers/index.js'
import { addItem } from '../db/addItem.js'
import { InDb } from '../db/db.js'
import { saveDependencies } from '../db/saveDependencies.js'

export const dependenciesParser = () => {
    const { files, dependencies } = InDb()
    const { trimImportPath } = arrayParser()

    for (const file of files) {
        if (!file.fullName.toString().endsWith('.tsx')) {
            continue
        }
        const filewithPath = `${global.rootDirectory}\\${file.fullName}`
        const content = fs.readFileSync(filewithPath, 'utf8')

        const fileDependencies = content.match(
            /(import.*from.'.*';?)|(import.*'.*';?)/gm
        )

        const depCollection: IImports[] = []
        if (fileDependencies !== null) {
            for (const depItem of fileDependencies) {
                const depObject = trimImportPath(depItem)
                if (!depObject) continue
                depCollection.push(depObject)
            }
        }

        const dependency: IDependency = {
            ...file,
            file: file.file,
            fullName: file.fullName,
            filePathFromSrc: file.filePathFromSrc,
            dependencies: depCollection,
        }
        addItem(dependencies, dependency)
    }
    saveDependencies(dependencies)
}
