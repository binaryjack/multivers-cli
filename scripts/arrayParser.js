import stringParsers from './stringParsers.js'
import fileManager from './fileManager.js'
// const sprs = require('./stringParser')
//https://js2ts.com/
const arrayParser = () => {
    const { fileExists } = fileManager()

    const { isNotProjectImport, splitAndTrim, sanitizeCollection, replaceAll } =
        stringParsers()

    const trimFromSrcDirectory = (directoriesArray) => {
        if (!Array.isArray(directoriesArray)) return ''
        const output = []
        let start = false
        for (const d of directoriesArray) {
            if (d === 'src' || start) {
                output.push(d)
                start = true
            }
        }
        return output
    }

    const trimImportPath = (importString) => {
        if (isNotProjectImport(importString)) return undefined
        const importSplitted = splitAndTrim(importString, 'from')
        const elements = splitAndTrim(importSplitted[0], ' ')
        const paths = splitAndTrim(importSplitted[1], '/')

        return {
            objects: sanitizeCollection(elements),
            paths: sanitizeCollection(paths),
        }
    }

    const getLastItem = (coll) => {
        return Array.isArray(coll) ? coll[coll.length - 1] : undefined
    }

    const buildDependencyPath = (paths) => {
        if (!paths?.length > 0) return ''
        const output = []
        for (const dp of paths) {
            if (['.', '..'].includes(dp)) continue
            output.push(dp)
        }
        return `${output.join('\\')}.tsx`
    }

    const buildPathOffset = (paths, offsetRight) => {
        if (!paths?.length > 0) return ''
        return paths.slice(0, -offsetRight).join('\\')
    }

    const buildPath = (paths) => {
        if (!paths?.length > 0) return ''
        return paths.join('\\')
    }

    const buildVersionPath = (paths, version) => {
        if (!paths?.length > 0) return ''
        const output = [...paths, `V${version}`]

        return output.join('\\')
    }

    const offsetPathRight = (path, offset) => {
        if (!path?.includes('\\')) return path
        return path.split('\\').slice(0, offset).join('\\')
    }

    const insertInPath = (path, where, what) => {
        if (!path?.includes('\\')) return path

        const pathParts = path.split('\\')

        return `${pathParts
            .slice(0, pathParts.length - where)
            .join('\\')}\\${what}\\${pathParts
            .slice(pathParts.length - where)
            .join('\\')}`
    }

    const mergePathToImport = (path, importsString) => {
        if (!importsString.includes(`'`)) return ''
        if (!importsString.includes(`/`)) return ''
        if (!path.includes(`\\`)) return ''

        let fromSplitted = importsString.split("'")[1].split('/')
        let pathSplitted = path.toString().split(`\\`)

        let isRelative = false
        let isRelativeToCurrentFolder = false
        if (fromSplitted[0] === '..') {
            fromSplitted = fromSplitted.slice(1)
            isRelative = true
        }

        let startFrom = ''

        if (fromSplitted[0] === '.') {
            fromSplitted = fromSplitted.slice(1)
            isRelativeToCurrentFolder = true

            startFrom = pathSplitted.lastIndexOf(fromSplitted[0])
        } else {
            startFrom = pathSplitted.indexOf(fromSplitted[0])
        }

        let target = pathSplitted.slice(startFrom).join('/').split('.')[0]

        let source = fromSplitted.join('/')

        if (isRelative) {
            source = `../${source}`
            target = `../../${target}`
        }

        if (isRelativeToCurrentFolder) {
            source = `./${source}`
            target = `./../${target}`
        }

        const fileName = fromSplitted[fromSplitted.length - 1]

        const sourceExists = fileExists(offsetPathRight(source, -1), fileName)
        const targetExists = fileExists(offsetPathRight(target, -1), fileName)

        return importsString.replace(source, target)
    }

    return {
        trimFromSrcDirectory,
        trimImportPath,
        getLastItem,
        buildDependencyPath,
        buildVersionPath,
        buildPath,
        buildPathOffset,
        offsetPathRight,
        insertInPath,
        mergePathToImport,
    }
}

export default arrayParser

//module.exports = { arrayParser }
