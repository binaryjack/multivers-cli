export const bakFilesKeyNameFactory =
    (backupDbDirectory: string) => (stamp: string) =>
        `${backupDbDirectory}\\raw_files.db.${stamp}.bak`
