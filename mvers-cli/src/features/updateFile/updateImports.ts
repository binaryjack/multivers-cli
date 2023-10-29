import fs from 'fs'

import { IExistingVersion } from '../../models/interop.js'
import { getRelativeDottedPath } from '../arrayParsers/buildPathOffset.js'
import {
    getFullComponentPahthFromSrc,
    getFullComponentPath,
    getPathList,
} from '../arrayParsers/init.js'
import InDb from '../db/index.js'
import { asVersion } from '../stringParsers/init.js'

export const updateImports = (
    uniqueFileList: IExistingVersion[],
    componentName: string,
    version: number
) => {
    //===================== ROOT COMPONENT ====================================
    const { flatHierarchies, getFHierarchies, versions, files, getVComponent } =
        InDb()
    const existingVersion = []
    const errors = []
    // version name
    const versionName = asVersion(version)
    const componentRef = getVComponent(componentName)
    const componentHierarchiesRef = getFHierarchies(componentName)

    if (!componentHierarchiesRef || !componentRef) return
    // as version name

    const pathFromSrc = getPathList(componentHierarchiesRef.componentFullName)

    //===================== ROOT COMPONENT ====================================

    for (const dep of componentHierarchiesRef.dependencies) {
        //===================== ROOT COMPONENT DEPENDENCY ====================================
        const currentComponent = dep.component

        if (!currentComponent) continue

        const componentPath = getFullComponentPath(currentComponent, version)
        const rootComponentPathOffset2 = getFullComponentPahthFromSrc(
            currentComponent,
            version
        )

        const foldersCountFromSrc = rootComponentPathOffset2.split('\\')?.length

        const relativePathToSrc = getRelativeDottedPath(foldersCountFromSrc)

        let content = fs.readFileSync(componentPath, 'utf8')
        const fileDependencies = content.match(
            /(import.*from.'.*';?)|(import.*'.*';?)/gm
        )

        const references = []
        //===================== ROOT COMPONENT DEPENDENCY ====================================

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
