/**
 * Removes . * + ? ^ $ { } ( ) | [ \ ] \  from the string
 * @param str string
 * @returns string
 */
export const escapeRegExp = (str: string): string => {
    return str?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
