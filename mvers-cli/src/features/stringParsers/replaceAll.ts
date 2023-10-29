import { escapeRegExp } from './escapeRegExp.js'

export const replaceAll = (str: string, find: string, replace: string) => {
    if (!str) return ''
    return str?.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}
