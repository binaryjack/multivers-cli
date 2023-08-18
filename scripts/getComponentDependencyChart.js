import fs from 'fs'
import stringParsers from './stringParsers.js'
import fileManager from './fileManager.js'
import dependencyBuilder from './dependencyBuilder.js'
import chalk from 'chalk'
import InDb from './db.js'
const getComponentDependencyChart = (
    root,
    component,
    searchWhere,
    recursive = false
) => {
    global.rootDirectory = root

    const { replaceAll } = stringParsers()
    const { directoryName } = fileManager()
    const { getComponent } = InDb()

    // get the component
    const foundComponent = getComponent(component, searchWhere)
    if (!foundComponent) return

    // build the dependency tree
    const { dependencyTree, errors } = dependencyBuilder(foundComponent)

    // if recursive set do the same process for all the references
    if (recursive) {
        for (const d of dependencyTree) {
            getComponentDependencyChart(
                root,
                d.root.fullName,
                searchWhere,
                false
            )
            getComponentDependencyChart(
                root,
                d.dep.fullName,
                searchWhere,
                false
            )
        }
    }
    console.clear()
    console.log(chalk.greenBright(`Dependency process finished`))

    let outputList = dependencyTree
        .map((row) => {
            const leftId = row.rootId
            const rightId = row.depId
            console.log('')
            const rootElement = `${leftId}[${row.root.file.name}]`
            const dependencyElement = `${rightId}[${row.dep.file.name}]`

            const association = `${rootElement}--{${row.dep.fullName}}-->${dependencyElement}`

            const rootHtmlFileName = `${replaceAll(
                row.root.fullName,
                '\\',
                '_'
            )}.html`

            const dependencyHtmlFileName = `${replaceAll(
                row.dep.fullName,
                '\\',
                '_'
            )}.html`

            const clickRoot = `click ${leftId} "${rootHtmlFileName}" "navigate to ${row.root.file.name}"`
            const clickDependency = `click ${rightId} "${dependencyHtmlFileName}" "navigate to ${row.dep.file.name}"`

            return `${association}\r\n
                    ${clickRoot}\r\n
                    ${clickDependency}\r\n
            `
        })
        .join()

    const outputDirectoryName = `${directoryName}\\versions\\relations`
    const outputFileName = `${outputDirectoryName}\\${replaceAll(
        foundComponent.fullName,
        '\\',
        '_'
    )}.html`

    const output = `<!DOCTYPE html>
        <html lang="en">
          <body>
            <pre class="mermaid">
            flowchart LR
            ${replaceAll(outputList, ',', '\n')}
            </pre>
            <script type="module">
              import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
              let config = {  maxTextSize: 90000, startOnLoad: true, flowchart: { useMaxWidth: false, htmlLabels: true } };
              mermaid.initialize(config);
          
          
              </script>
          </body>
        </html>`

    if (!fs?.existsSync(outputDirectoryName)) {
        fs?.mkdirSync(outputDirectoryName)
    }

    if (fs?.existsSync(outputFileName)) {
        fs?.unlinkSync(outputFileName)
    }

    fs.writeFileSync(outputFileName, output, 'utf-8')
    console.clear()
    console.log(
        chalk.greenBright(
            `Process Complete - Output File: ", ${outputFileName}`
        )
    )
}
export default getComponentDependencyChart
