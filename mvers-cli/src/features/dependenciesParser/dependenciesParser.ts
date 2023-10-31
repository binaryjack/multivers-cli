import fs from 'fs'

import { IDependency, IImports } from '../../models/interop.js'
import { InDb } from '../db/db.js'
import { saveDependencies } from '../db/saveDependencies.js'
import { trimImportPath } from '../helpers/trimImportPath.js'

/**
 * Dependencies parser
 */
export const dependenciesParser = () => {
    const { files } = InDb()

    const output: IDependency[] = []
    for (const file of files) {
        if (!file.fullName.toString().endsWith('.tsx')) {
            continue
        }
        const fileWithPath = `${global.rootDirectory}\\${file.fullName}`
        const content = fs.readFileSync(fileWithPath, 'utf8')

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
        output.push(dependency)
    }
    saveDependencies(output)
}
