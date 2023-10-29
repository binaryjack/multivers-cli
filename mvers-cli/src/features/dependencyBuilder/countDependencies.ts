export const countDependencies = (dependency: any, count = 0): number => {
    count += dependency?.dependencies?.length
    for (const c of dependency.dependencies) {
        if (c?.dependencies?.length > 0) {
            return countDependencies(c, count)
        }
    }
    return count
}
