export interface IFileParts {
    name: string
    extension: string
}

export const getExtension = (str: string): IFileParts => {
    if (!str?.includes('.')) return { name: str, extension: '' }
    const nameParts = str.split('.')

    const extension = nameParts[nameParts.length - 1]
    const fileName = nameParts.slice(0, nameParts.length - 1).join('.')

    return { name: fileName, extension: extension }
}
