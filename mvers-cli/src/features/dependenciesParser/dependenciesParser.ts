import fs from 'fs'

import { IDependency, IImports } from '../../models/interop.js'
import { buildPathLeftOffset } from '../arrayParsers/buildPathOffset.js'
import arrayParser from '../arrayParsers/index.js'
import { getPathList } from '../arrayParsers/init.js'
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

export const dependenciesUpdater = () => {
    const { dependencies } = InDb()

    for (const item of dependencies) {
        if (!item.fullName.toString().endsWith('.tsx')) {
            continue
        }

        const pathFromSrc = buildPathLeftOffset(item.filePathFromSrc, 1)
        const pathList = getPathList(pathFromSrc)

        const isVersionnedMatch = RegExp(/\\V\d\\?/).exec(pathFromSrc)

        const isVersionned = !!isVersionnedMatch

        const referencedVerison = isVersionnedMatch?.[0].replace(/\\/, '')

        const pathCount = pathList.length

        for (const deps of item.dependencies) {
            // for dependencies located in same directory level do nothing
            if (
                deps.objects.length > 0 &&
                deps.objects[0] === '.' &&
                deps.paths.length === 0
            )
                continue

            // for dependencies path located in same level directory  only if version differs
            if (
                deps.paths.length > 0 &&
                deps.paths[0] === '.' &&
                !deps.paths.find((o) => o === referencedVerison) &&
                isVersionned &&
                referencedVerison
            ) {
                // append extra step to the component
                let currentTempPaths = ['.', '..', ...deps.paths.slice(1)]
                deps.paths = adaptPaths(
                    dependencies,
                    currentTempPaths,
                    referencedVerison
                )
            } else if (
                deps.paths.length > 0 &&
                deps.paths.filter((o) => o === '..').length !== pathCount &&
                !deps.paths.find((o) => o === referencedVerison) &&
                isVersionned &&
                referencedVerison
            ) {
                // append extra step to the component
                let currentTempPaths = ['..', ...deps.paths]
                deps.paths = adaptPaths(
                    dependencies,
                    currentTempPaths,
                    referencedVerison
                )
            }
        }
    }
    saveDependencies(dependencies)
}

export const adaptPaths = (
    dependencies: IDependency[],
    currentTempPaths: string[],
    referencedVerison: string
) => {
    // prepare output collection
    let output: string[] = [...currentTempPaths]
    // get the component name  (usually is the last item of a dependency list)
    const dependencyComponentName = output[output.length - 1]
    // build the part of the path corresponding to the versionned component
    const versionnedNamePath = `${referencedVerison}\\${dependencyComponentName}.tsx`
    // try find the component in the dependecies file
    if (dependencies.find((o) => o.fullName.includes(versionnedNamePath))) {
        // if found the update the paths
        output = [
            ...output.slice(0, -1),
            referencedVerison,
            dependencyComponentName,
        ]
    }
    // return all
    return output
}

interface IPrepareImportsToReplace {
    replaceBy: string
    originalImport?: string
    targetCompoment: string
}

export const importsUpdater = () => {
    const { dependencies } = InDb()

    for (const item of dependencies) {
        if (!item.fullName.toString().endsWith('.tsx')) {
            continue
        }

        const pathFromSrc = buildPathLeftOffset(item.filePathFromSrc, 1)

        const isVersionnedMatch = RegExp(/\\V\d\\?/).exec(pathFromSrc)

        const isVersionned = !!isVersionnedMatch
        // if is not a versionned component then skip
        if (!isVersionned) continue

        const filewithPath = `${global.rootDirectory}\\${item.fullName}`
        let content = fs.readFileSync(filewithPath, 'utf8')

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
                targetCompoment: componentName,
            })
        }

        if (newImports.length === 0) continue

        for (const nImp of newImports) {
            const originalImport = fileImports.find((o) =>
                o.includes(nImp.targetCompoment)
            )
            if (!originalImport) continue
            nImp.originalImport = originalImport
        }

        for (const nImp of newImports) {
            if (!nImp.originalImport) continue
            content = content.replace(nImp.originalImport, nImp.replaceBy)
        }

        fs.writeFileSync(filewithPath, content, 'utf8')
    }
    saveDependencies(dependencies)
}
