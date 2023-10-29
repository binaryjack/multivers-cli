import fs from 'fs'

import { IExistingVersion } from '../../models/interop.js'
import { buildVersionPath } from '../arrayParsers/buildVersionPath.js'
import InDb from '../db/index.js'

export const updateImports = (
    uniqueFileList: IExistingVersion[],
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

    if (!componentHierarchiesRef) return

    const versionName = `V${version}`

    const pathFromSrc = componentHierarchiesRef.componentFullName.split('\\')

    for (const dep of componentHierarchiesRef.dependencies) {
        const currentComponent = dep.component

        if (!currentComponent) continue

        const componentPath = `${global.rootDirectory}\\${buildVersionPath(
            currentComponent.filePathFromSrc,
            version
        )}\\${currentComponent.file.name}.${currentComponent.file.extension}`

        // const rootComponentPathOffset = buildPathOffset(
        //     currentComponent.filePathFromSrc,
        //     1
        // )

        // const rootComponentPathOffset2 = `${buildPathLeftOffset(
        //     currentComponent.filePathFromSrc,
        //     1
        // )}\\${versionName}`

        // const foldersCountFromSrc = rootComponentPathOffset2.split('\\')?.length

        // const relativePathToSrc = getRelativeDottedPath(foldersCountFromSrc)

        let content = fs.readFileSync(componentPath, 'utf8')
        const fileDependencies = content.match(
            /(import.*from.'.*';?)|(import.*'.*';?)/gm
        )

        const references = []

        for (const cDep of currentComponent.dependencies) {
            if (cDep?.paths?.length === 0) continue

            // const tmpComponentName = `${versionName}\\${
            //     cDep.paths[cDep.paths.length - 1]
            // }`

            // const lastOcc = `\\${cDep.paths[cDep.paths.length - 1]}`

            // const found1 = files.find((o) => o.fullName.includes(lastOcc))

            // const found2 = files.find((o) =>
            //     o.fullName.includes(tmpComponentName)
            // )

            // const pathVersion2 = `${relativePathToSrc.join(
            //     '\\'
            // )}\\${buildPathLeftOffset(found2?.filePathFromSrc ?? [], 1)}\\${
            //     cDep.paths[cDep.paths.length - 1]
            // }`

            // const path = ['.', '..'].includes(cDep.paths[0])
            //     ? buildPath(cDep.paths.slice(1))
            //     : buildPath(cDep.paths)

            // if (path === '') continue

            // const rawFile = files.find((o) => o.fullName.includes(path))

            // const currentImportPath = fileDependencies?.find((o) =>
            //     o.includes(replaceAll(path, '\\', '/'))
            // )

            // // try find the version ### file
            // const pathVersion = insertInPath(
            //     rawFile ? rawFile.fullName : '',
            //     1,
            //     versionName
            // )

            // const fullPath = `${global.rootDirectory}\\${found2?.fullName}`

            // if (fs.existsSync(fullPath)) {
            //     references.push({
            //         path: fullPath,
            //         import: currentImportPath,
            //     })
            // }
        }

        // for (const r of references) {
        //     if (!r.import) continue
        //     const replaceBy = mergePathToImport(r.path, r.import)
        //     content = content.replace(r.import, replaceBy)
        // }

        // fs.writeFileSync(componentPath, content, 'utf8')
    }
}
