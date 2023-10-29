import { clearVersion } from './clearVersion.js'
import { getFilesVersionsAndClear } from './getFilesVersionsAndClear.js'

const clearVersions = () => {
    return { clearVersion, getFilesVersionsAndClear }
}

export default clearVersions
