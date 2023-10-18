import fs from 'fs'

import arrayParser from '../arrayParsers/index.js'
import { IImports } from '../arrayParsers/trimImportPath.js'
import { addItem } from '../db/addItem.js'
import { IDependency, InDb } from '../db/db.js'
import { saveDependencies } from '../db/saveDependencies.js'
import { fileManager } from '../filesManager/filesManager.js'

export const dependenciesParser = () => {
    const { files, dependencies } = InDb()
    const { trimImportPath } = arrayParser()
    const { directoryName } = fileManager()

    for (const file of files) {
        if (!file.fullName.toString().endsWith('.tsx')) {
            continue
        }
        const filewithPath = `${directoryName}\\${file.fullName}`
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
