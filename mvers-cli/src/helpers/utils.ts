export const setGlobalRoot = (root: string) => {
    global.rootDirectory = root.endsWith('\\')
        ? root.substring(0, root.length - 1)
        : root
}
