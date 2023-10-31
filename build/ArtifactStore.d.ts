export default interface ArtifactStore {
    uploadArtifact(name: string, files: string[], retentionDays?: number): Promise<void>;
}
export declare function uploadArtifact(artifactStore: ArtifactStore, archiveFile: string, retentionDays?: number): Promise<{
    archiveFile: string;
}>;
