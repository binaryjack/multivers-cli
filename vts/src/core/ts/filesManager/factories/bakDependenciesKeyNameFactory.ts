export const bakDependenciesKeyNameFactory =
    (backupDbDirectory: string) => (stamp: string) =>
        `${backupDbDirectory}\\dependencies.db.${stamp}.bak`
