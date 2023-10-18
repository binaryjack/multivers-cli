import fs from 'fs'
import InDb from './db.js'
import arrayParser from './arrayParser.js'
import fileManager from './fileManager.js'

const dependenciesParser = () => {
    const { files, saveDependencies, dependencies, addItem } = InDb()
    const { trimImportPath } = arrayParser()
    const { directoryName } = fileManager()

    for (const file of files) {
        if (!file.fullName.toString().endsWith('.tsx')) {
            continue
        }
        const filewithPath = `${directoryName}\\${file.fullName}`
        const content = fs.readFileSync(filewithPath, 'utf8')

        const fileDependencies = content.match(
            /(import.*from.'.*';?)|(import.*'.*';?)/gm
        )

        const depCollection = []
        if (fileDependencies !== null) {
            for (const depItem of fileDependencies) {
                const depObject = trimImportPath(depItem)
                if (!depObject) continue
                depCollection.push(depObject)
            }
        }

        const dependency = {
            file: file.file,
            fullName: file.fullName,
            filePathFromSrc: file.filePathFromSrc,
            dependencies: depCollection,
        }
        addItem(dependencies, dependency)
    }
    saveDependencies()
}
export default dependenciesParser
// module.exports = { dependenciesParser }
