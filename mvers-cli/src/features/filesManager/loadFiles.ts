import fs from 'fs'

export const loadFiles = (fileName: string) => {
    try {
        if (fs.existsSync(fileName)) {
            const data: string = fs.readFileSync(fileName, {
                encoding: 'utf-8',
            })
            if (data) {
                return JSON.parse(data)
            }
            return []
        }
    } catch (err) {
        console.log(err)
    }
    return []
}
