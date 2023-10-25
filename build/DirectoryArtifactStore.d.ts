import ArtifactStore from './ArtifactStore';
export default class DirectoryArtifactStore implements ArtifactStore {
    directory: string;
    constructor(directory: string);
    /**
     * @param _retentionDays Ignored by this implementation.
     */
    uploadArtifact(name: string, files: string[], _retentionDays: number): Promise<void>;
}
