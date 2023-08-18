import fs from 'fs'
import InDb from './db.js'
import dependenciesParser from './dependenciesParser.js'
import stringParsers from './stringParsers.js'
import arrayParser from './arrayParser.js'

const build = (startFolder) => {
    global.rootDirectory = startFolder

    console.log('build', global.rootDirectory)

    const { saveFiles, files, addItem, directoryName } = InDb()
    const { splitAndTrim, getExtension } = stringParsers()
    const { trimFromSrcDirectory } = arrayParser()

    const recursFiles = (path, output = []) => {
        const fileList = fs.readdirSync(path)
        for (const file of fileList) {
            if (path.includes('node_modules') || file.includes('node_modules'))
                continue

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

    const collectedFiles = recursFiles(directoryName)

    for (const file of collectedFiles) {
        addItem(files, file)
    }
    saveFiles()
    dependenciesParser()
}

export default build

///module.export = { build }
