import ArtifactStore from './ArtifactStore';
export default class GitHubArtifactStore implements ArtifactStore {
    uploadArtifact(name: string, files: string[], retentionDays?: number): Promise<void>;
}
