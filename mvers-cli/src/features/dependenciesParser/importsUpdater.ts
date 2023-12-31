import fs from 'fs'

import { IPrepareImportsToReplace } from '../../models/interop.js'
import { InDb } from '../db/db.js'
import { saveDependencies } from '../db/saveDependencies.js'
import { buildPathLeftOffset } from '../helpers/buildPathLeftOffset.js'

/**
 * Import Updater
 */
export const importsUpdater = () => {
    const { dependencies } = InDb()

    for (const item of dependencies) {
        if (!item.fullName.toString().endsWith('.tsx')) {
            continue
        }

        const pathFromSrc = buildPathLeftOffset(item.filePathFromSrc, 1)

        const isVersionedMatch = RegExp(/\\V\d\\?/).exec(pathFromSrc)

        const isVersioned = !!isVersionedMatch
        // if is not a versioned component then skip
        if (!isVersioned) continue

        const fileWithPath = `${global.rootDirectory}\\${item.fullName}`
        let content = fs.readFileSync(fileWithPath, 'utf8')

        const fileImports = content.match(
            /(import.*from.'.*';?)|(import.*'.*';?)/gm
        )
        // if there is not any import then skip
        if (!fileImports) continue

        const newImports: IPrepareImportsToReplace[] = []

        for (const deps of item.dependencies) {
            if (deps.paths.length === 0) continue
            // component name
            const componentName = deps.paths[deps.paths.length - 1]
            const fullPath = deps.paths.join('\\')
            // should check if is default or not in the original file ?
            const importTxt = `import ${componentName} from '${fullPath.replace(
                /\\/gi,
                '/'
            )}'`
            newImports.push({
                replaceBy: importTxt,
                targetComponent: componentName,
            })
        }

        if (newImports.length === 0) continue

        for (const nImp of newImports) {
            const originalImport = fileImports.find((o) =>
                o.includes(nImp.targetComponent)
            )
            if (!originalImport) continue
            nImp.originalImport = originalImport
        }

        for (const nImp of newImports) {
            if (!nImp.originalImport) continue
            content = content.replace(nImp.originalImport, nImp.replaceBy)
        }

        fs.writeFileSync(fileWithPath, content, 'utf8')
    }
    saveDependencies(dependencies)
}
