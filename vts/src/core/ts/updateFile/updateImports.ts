import fs from 'fs'

import { buildPath } from '../arrayParsers/buildPath.js'
import { buildPathOffset } from '../arrayParsers/buildPathOffset.js'
import { buildVersionPath } from '../arrayParsers/buildVersionPath.js'
import { insertInPath } from '../arrayParsers/insertInPath.js'
import { mergePathToImport } from '../arrayParsers/mergePathToImport.js'
import InDb from '../db/index.js'
import { replaceAll } from '../stringParsers/replaceAll.js'

export const updateImports = (
    uniqueFileList,
    componentName: string,
    version: number
) => {
    const { flatHierarchies, versions, files } = InDb()
    const existingVersion = []
    const componentRef = versions.find(
        (o) => o.componentFullName === componentName
    )
    const errors = []
    const componentHierarchiesRef = flatHierarchies.find(
        (o) => o.componentFullName === componentName
    )

    const versionName = `V${version}`

    for (const dep of componentHierarchiesRef.dependencies) {
        const currentComponent = dep.component
        const componentPath = `${global.rootDirectory}\\${buildVersionPath(
            currentComponent.filePathFromSrc,
            version
        )}\\${currentComponent.file.name}.${currentComponent.file.extension}`

        const rootComponentPathOffset = buildPathOffset(
            currentComponent.filePathFromSrc,
            1
        )

        let content = fs.readFileSync(componentPath, 'utf8')
        const fileDependencies = content.match(
            /(import.*from.'.*';?)|(import.*'.*';?)/gm
        )

        const references = []

        for (const cDep of currentComponent.dependencies) {
            if (cDep?.paths?.length === 0) continue

            const path = ['.', '..'].includes(cDep.paths[0])
                ? buildPath(cDep.paths.slice(1))
                : buildPath(cDep.paths)

            if (path === '') continue

            const rawFile = files.find((o) => o.fullName.includes(path))

            if (!rawFile) {
                console.log('not found', path)
                continue
            }
            // Import present in the ccomponent file
            const currentImportPath = fileDependencies.find((o) =>
                o.includes(replaceAll(path, '\\', '/'))
            )

            // try find the version ### file
            const pathVersion = insertInPath(rawFile.fullName, 1, versionName)

            const fullPath = `${global.rootDirectory}\\${pathVersion}`

            if (fs.existsSync(fullPath)) {
                references.push({
                    path: fullPath,
                    import: currentImportPath,
                })
            }
        }

        for (const r of references) {
            const originalImport = r.import
            const replaceBy = mergePathToImport(r.path, r.import)
            content = content.replace(originalImport, replaceBy)
        }

        fs.writeFileSync(componentPath, content, 'utf8')
    }
}
