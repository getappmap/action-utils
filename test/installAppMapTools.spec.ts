import fs, {existsSync, readFileSync} from 'fs';
import installAppMapTools from '../src/installAppMapTools';
import * as locateToolsRelease from '../src/locateToolsRelease';
import * as downloadFile from '../src/downloadFile';
import verbose from '../src/verbose';
import {mkdir, readFile, rm, writeFile} from 'fs/promises';
import {join} from 'path';

if (process.env.VERBOSE) verbose(true);

describe('installAppMapTools', () => {
  let testOutputDir = join(__dirname, '..', 'tmp', 'test-output');

  beforeEach(() => mkdir(testOutputDir, {recursive: true}));
  afterEach(() => rm(testOutputDir, {recursive: true, force: true}));
  afterEach(() => jest.restoreAllMocks());

  describe('when tools are not already installed', () => {
    it('installs them', async () => {
      const mockLocateToolsRelease = jest.spyOn(locateToolsRelease, 'default');
      mockLocateToolsRelease.mockResolvedValueOnce('https://example.com/appmap-linux-x64');
      const mockDownloadFile = jest.spyOn(downloadFile, 'default');
      let appmapTempPath: string;
      mockDownloadFile.mockImplementation(async (_url, path) => {
        appmapTempPath = path;
        await writeFile(appmapTempPath, 'not-real-appmap-binary');
      });

      await installAppMapTools(join(testOutputDir, 'appmap-tools'), {force: true});

      expect(mockLocateToolsRelease).toHaveBeenCalledTimes(1);
      expect(mockDownloadFile).toHaveBeenCalledTimes(1);

      expect(existsSync(join(testOutputDir, 'appmap-tools'))).toBeTruthy();
      expect(await readFile(join(testOutputDir, 'appmap-tools'), 'utf8')).toEqual(
        'not-real-appmap-binary'
      );
    });
  });

  describe('when tools are already installed', () => {
    beforeEach(() => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    });

    it('does not install them again', async () => {
      const mockLocateToolsRelease = jest.spyOn(locateToolsRelease, 'default');
      const mockDownloadFile = jest.spyOn(downloadFile, 'default');

      await installAppMapTools('/no/such/dir');
      expect(mockLocateToolsRelease).not.toHaveBeenCalled();
      expect(mockDownloadFile).not.toHaveBeenCalled();
    });

    describe('and force option is true', () => {
      it('installs them again', async () => {
        const mockLocateToolsRelease = jest.spyOn(locateToolsRelease, 'default');
        mockLocateToolsRelease.mockResolvedValueOnce('https://example.com/appmap-linux-x64');
        const mockDownloadFile = jest.spyOn(downloadFile, 'default');
        mockDownloadFile.mockImplementation(async (_url, path) => {
          await writeFile(path, 'not-real-appmap-binary');
        });

        await installAppMapTools(join(testOutputDir, 'appmap-tools'), {force: true});

        expect(mockLocateToolsRelease).toHaveBeenCalledTimes(1);
        expect(mockDownloadFile).toHaveBeenCalledTimes(1);
      });
    });
  });
});
