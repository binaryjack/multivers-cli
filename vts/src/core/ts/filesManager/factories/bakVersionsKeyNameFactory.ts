export const bakVersionsKeyNameFactory =
    (backupDbDirectory: string) => (stamp: string) =>
        `${backupDbDirectory}\\files_versions.db.${stamp}.bak`
