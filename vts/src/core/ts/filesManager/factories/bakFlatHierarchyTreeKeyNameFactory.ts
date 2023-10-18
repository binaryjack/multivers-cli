export const bakFlatHierarchyTreeKeyNameFactory =
    (backupDbDirectory: string) => (stamp: string) =>
        `${backupDbDirectory}\\flathierarchytree.db.${stamp}.bak`
