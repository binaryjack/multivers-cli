export const mergePathToImport = (path: string, importsString: string) => {
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

    let startFrom = 0

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

    // const sourceExists = fileExists(offsetPathRight(source, -1), fileName)
    // const targetExists = fileExists(offsetPathRight(target, -1), fileName)

    return importsString.replace(source, target)
}
