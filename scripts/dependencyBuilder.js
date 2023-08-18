import fs from 'fs'
import InDb from './db.js'
import stringParsers from './stringParsers.js'
import fileManager from './fileManager.js'
import settings from './settings.js'
import arrayParser from './arrayParser.js'
import chalk from 'chalk'
import cliProgress from 'cli-progress'

const trace = (text, value) =>
    console.log(chalk.greenBright(`${text}, ${value}`))

const errorTrace = (text, value) => console.log(chalk.red(`${text}, ${value}`))
// gets the next ID
const nextId = (components, componentName, id) => {
    try {
        const root = components.find((o) => o.root.file.name === componentName)
        if (root) {
            // trace('nextId.found.root:', root.rootId)
            return root.rootId
        }
        const dep = components.find((o) => o.dep.file.name === componentName)
        if (dep) {
            // trace('nextId.found.dep:', dep.depId)
            return dep.depId
        }
        let outputId = id
        while (
            components.find(
                (o) => o.rootId === outputId || o.depId === outputId
            )
        ) {
            // trace('nextId increment:', outputId)

            outputId++
        }
        //trace('nextId output:', outputId)
        return outputId
    } catch (e) {
        errorTrace(`nextId.error: `, e.message)
    }
}
const dependencyBuilder = (component) => {
    const { dependencies } = InDb()
    const { buildDependencyPath } = arrayParser()

    let dependencyTree = []
    const errors = []

    if (!component) {
        return {
            dependencyTree: [],
            errors: ['no component provided'],
        }
    }

    const countDependencies = (r, count = 0) => {
        count += r?.dependencies?.length
        for (const c of r.dependencies) {
            if (c?.dependencies?.length > 0) {
                return countDependencies(c, count)
            }
        }
        return count
    }

    const max = countDependencies(component)

    const getDependencies = (
        root,
        rootId = -1,
        depId = 0,
        outputGraph = []
    ) => {
        try {
            rootId = nextId(outputGraph, root.file.name, rootId + 1)

            if (!root.dependencies) return outputGraph
            for (const dependency of root.dependencies) {
                const dependencyPartialFullPath = buildDependencyPath(
                    dependency.paths
                )
                if (dependencyPartialFullPath === '') continue

                const dep = dependencies.find((o) => {
                    return o.fullName.includes(dependencyPartialFullPath)
                })

                if (dep) {
                    depId = nextId(outputGraph, dep.file.name, depId + 1)

                    if (
                        outputGraph.find(
                            (o) => o.rootId === rootId && o.depId === depId
                        )
                    ) {
                        continue
                    }
                    outputGraph.push({
                        rootId: rootId,
                        depId: depId,
                        root: root,
                        dep: dep,
                    })

                    getDependencies(dep, rootId, depId, outputGraph)
                }
            }

            return outputGraph
        } catch (e) {
            errorTrace(`getDependencies.error: `, e.message)
        }
    }

    dependencyTree = getDependencies(component)

    return {
        dependencyTree: dependencyTree,
        errors: errors,
    }
}

export default dependencyBuilder
