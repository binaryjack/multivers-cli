// import { skipDirectories } from '../helpers/utils'
// import { Common, common } from '../settings/common'

// export class IFileManager extends Common {
//     constructor(root: string) {
//         super(root)
//     }
//     private skip = this.common.skipDirectories

//     getCount(directory: string) {
//         //
//     }
//     getAllIFiles(directory: string, skip?: string[]) {
//         //
//     }
//     save(IFileName: string, data: string, backup?: boolean) {
//         //
//     }
//     load() {
//         //
//     }
// }

export interface IFile {
    name: string
    directories: string[]
    fullName: string
    pathOnly: string
}
