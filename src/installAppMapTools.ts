import os, {tmpdir} from 'os';
import locateToolsRelease from './locateToolsRelease';
import log, {LogLevel} from './log';
import {join} from 'path';
import executeCommand from './executeCommand';
import {chmod, mkdtemp, rm} from 'fs/promises';
import {existsSync} from 'fs';
import downloadFile from './downloadFile';

export type InstallAppMapToolsOptions = {
  toolsURL?: string;
  force?: boolean;
  githubToken?: string;
};

export default async function installAppMapTools(
  toolsPath: string,
  options: InstallAppMapToolsOptions = {}
) {
  if (existsSync(toolsPath) && !options.force) {
    log(LogLevel.Info, `AppMap tools are already installed at ${toolsPath}. Skipping this step...`);
    return;
  }

  const platform = [os.platform() === 'darwin' ? 'macos' : os.platform(), os.arch()].join('-');
  const toolsReleaseURL =
    options.toolsURL || (await locateToolsRelease(platform, options.githubToken));
  if (!toolsReleaseURL) throw new Error('Could not find @appland/appmap release');

  log(LogLevel.Info, `Installing AppMap tools from ${toolsReleaseURL}`);

  const tempDir = await mkdtemp(join(tmpdir(), 'appmap-tools-'));
  const appmapTempPath = join(tempDir, 'appmap');
  await downloadFile(new URL(toolsReleaseURL), appmapTempPath);
  try {
    await executeCommand(`mv ${appmapTempPath} ${toolsPath}`);
  } catch (e) {
    await executeCommand(`sudo mv ${appmapTempPath} ${toolsPath}`);
  }
  await chmod(toolsPath, 0o755);
  await rm(tempDir, {recursive: true});

  log(LogLevel.Info, `AppMap tools are installed at ${toolsPath}`);
}
