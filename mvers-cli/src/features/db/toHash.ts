/**
 * converts string to hash
 * @param str
 * @returns
 */
export const toHash = (str: string) => {
    if (str === '') return 0
    let hashString = 0
    for (let character of str) {
        let charCode = character.charCodeAt(0)
        hashString = hashString << (5 - hashString)
        hashString += charCode
        hashString |= hashString
    }
    return hashString
}
