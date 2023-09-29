import {readFileSync} from 'fs';
import downloadFile from '../src/downloadFile';
import verbose from '../src/verbose';
import {mkdir, rm} from 'fs/promises';
import {join} from 'path';

if (process.env.VERBOSE) verbose(true);

describe('downloadFile', () => {
  let testOutputDir = join(__dirname, '..', 'tmp', 'test-output');

  beforeEach(() => mkdir(testOutputDir, {recursive: true}));
  afterEach(() => rm(testOutputDir, {recursive: true, force: true}));
  afterEach(() => jest.restoreAllMocks());

  it('downloads a file', async () => {
    await downloadFile(new URL(`file:///${__filename}`), join(testOutputDir, 'downloadFile.spec.ts'));

    expect(readFileSync(join(testOutputDir, 'downloadFile.spec.ts'), 'utf8')).toEqual(
      readFileSync(__filename, 'utf-8')
    );
  });

  it('downloads a URL', async () => {
    await downloadFile(new URL('https://google.com'), join(testOutputDir, 'google.com'));

    expect(readFileSync(join(testOutputDir, 'google.com'), 'utf8').toLowerCase()).toContain(
      'google'
    );
  });
});
