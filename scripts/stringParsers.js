import settings from './settings.js'

const stringParsers = () => {
    const { notProjectImport } = settings()

    const escapeRegExp = (str) => {
        return str?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
    }

    const replaceAll = (str, find, replace) => {
        if (!str) return ''
        return str?.replace(new RegExp(escapeRegExp(find), 'g'), replace)
    }

    const getExtension = (str) => {
        if (!str?.includes('.')) return { name: str, extension: '' }
        const nameParts = str.split('.')

        const extension = nameParts[nameParts.length - 1]
        const fileName = nameParts.slice(0, nameParts.length - 1).join('.')

        return { name: fileName, extension: extension }
    }

    const splitAndTrim = (str, separator) => {
        if (!str?.includes(separator)) return [str]
        const splitted = str.split(separator)
        const sanitizedOutput = []
        for (const s of splitted) {
            sanitizedOutput.push(s)
        }
        return sanitizedOutput
    }

    const sanitizeCollection = (str) => {
        if (!Array.isArray(str)) return []
        const toSanitize = []

        for (const s of str) {
            if (!s) continue

            if (s?.includes('/')) {
                toSanitize.push(...s.split('/'))
            } else {
                toSanitize.push(s)
            }
        }

        const sanitizedOutput = []

        for (const s of toSanitize) {
            const stm = sanitize(s)
            if (!stm) continue
            sanitizedOutput.push(stm)
        }
        return sanitizedOutput
    }

    const takeFolderUntil = (path, to) => {
        if (!path?.includes('\\')) return path
        if (!to) return path
        const output = []

        for (const f of path.split('\\')) {
            if (!f) continue
            output.push(f)
            if (f === to) return output.join('\\')
        }
    }

    const sanitize = (val) => {
        const pass1 = val.replaceAll('import', '')
        const pass2 = pass1.replaceAll(`'`, '')
        const pass3 = pass2.replaceAll(`;`, '')
        const pass4 = pass3.replaceAll(`,`, ' ')
        const pass5 = pass4.replaceAll(`}`, ' ')
        const pass6 = pass5.replaceAll(`{`, ' ')
        const pass7 = pass6.replaceAll(`/`, '')

        return pass7.trim()
    }

    const isNotProjectImport = (val) => {
        if (!val) return false
        for (const e of notProjectImport) {
            if (val.includes(e)) {
                return true
            }
        }
        return false
    }

    return {
        takeFolderUntil,
        getExtension,
        sanitizeCollection,
        replaceAll,
        sanitize,
        isNotProjectImport,
        splitAndTrim,
    }
}

export default stringParsers
