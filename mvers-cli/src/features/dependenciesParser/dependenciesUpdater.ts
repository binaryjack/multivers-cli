import { buildPathLeftOffset } from '../arrayParsers/buildPathLeftOffset.js'
import { getPathList } from '../arrayParsers/getPathList.js'
import { InDb } from '../db/db.js'
import { saveDependencies } from '../db/saveDependencies.js'
import { adaptPaths } from './adaptPaths.js'

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
