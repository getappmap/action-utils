import {basename, dirname} from 'path';
import log, {LogLevel} from './log';

export default interface ArtifactStore {
  uploadArtifact(name: string, files: string[], retentionDays?: number): Promise<void>;
}

export async function uploadArtifact(
  artifactStore: ArtifactStore,
  archiveFile: string,
  retentionDays?: number
): Promise<{archiveFile: string}> {
  log(LogLevel.Debug, `Processing AppMap archive ${archiveFile}`);

  // e.g. .appmap/archive/full
  const dir = dirname(archiveFile);
  // e.g. appmap-archive-full
  const artifactPrefix = dir.replace(/\//g, '-').replace(/\./g, '');
  const [sha] = basename(archiveFile).split('.');
  const artifactName = `${artifactPrefix}_${sha}.tar`;

  await artifactStore.uploadArtifact(artifactName, [archiveFile], retentionDays);

  return {archiveFile};
}
