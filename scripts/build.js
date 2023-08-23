import fs from 'fs'
import InDb from './db.js'
import dependenciesParser from './dependenciesParser.js'
import stringParsers from './stringParsers.js'
import arrayParser from './arrayParser.js'
import filesManager from './fileManager.js'
import progress from './progress.js'

const build = (startFolder) => {
    global.rootDirectory = startFolder

    console.log('build', global.rootDirectory)

    const { saveFiles, files, addItem, directoryName } = InDb()
    const { splitAndTrim, getExtension } = stringParsers()
    const { trimFromSrcDirectory } = arrayParser()
    const { countFilesInDirectory, skipDirectory } = filesManager()

    const count = countFilesInDirectory(startFolder)
    const { start, stop, incr, info } = progress()
    start(count)
    const recursFiles = (path, output = []) => {
        if (skipDirectory(path)) return output

        incr(path)

        const fileList = fs.readdirSync(path)
        for (const file of fileList) {
            incr(file)

            const currentFile = `${path}\\${file}`
            if (fs.statSync(currentFile).isDirectory()) {
                recursFiles(currentFile, output)
            } else {
                const splittedPath = splitAndTrim(path, '\\')
                const filePathFromSrc = trimFromSrcDirectory(splittedPath)
                const filePathWithFileName = [...filePathFromSrc, file]
                const fileDesc = {
                    id: output.length === 0 ? 0 : output.length + 1,
                    file: getExtension(file),
                    filePathFromSrc: filePathFromSrc,
                    fullName: filePathWithFileName.join('\\'),
                }
                output.push(fileDesc)
            }
        }
        return output
    }
    stop()
    const collectedFiles = recursFiles(directoryName)

    for (const file of collectedFiles) {
        addItem(files, file)
    }

    info('Process finished')

    saveFiles()
    dependenciesParser()
}

export default build

///module.export = { build }
