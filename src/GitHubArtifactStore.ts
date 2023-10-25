import * as artifact from '@actions/artifact';
import ArtifactStore from './ArtifactStore';

export default class GitHubArtifactStore implements ArtifactStore {
  async uploadArtifact(name: string, files: string[], retentionDays?: number): Promise<void> {
    const artifactClient = artifact.create();
    const options: artifact.UploadOptions = {};
    if (retentionDays) options.retentionDays = retentionDays;
    await artifactClient.uploadArtifact(name, files, process.cwd(), options);
  }
}
