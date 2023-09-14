import executeCommand from '../src/executeCommand';
import verbose from '../src/verbose';
import * as log from '../src/log';

if (process.env.VERBOSE) verbose(true);

describe('executeCommand', () => {
  // Mock the log function so we can check if it was called
  let mockLog: jest.SpyInstance;

  beforeEach(() => (mockLog = jest.spyOn(log, 'default')));
  afterEach(() => jest.restoreAllMocks());

  it('can list files', async () => {
    const result = await executeCommand('ls -l');

    expect(result).toContain('package.json');
    expect(mockLog).not.toHaveBeenCalled();
  });

  it('prints the command, stdout, stderr if requested', async () => {
    const result = await executeCommand('ls -l', {
      printCommand: true,
      printStdout: true,
      printStderr: true,
    });

    expect(result).toContain('package.json');
    expect(mockLog).toHaveBeenCalledTimes(2);
    expect(mockLog).nthCalledWith(1, log.LogLevel.Debug, 'command: ls -l');
    expect(mockLog).nthCalledWith(2, log.LogLevel.Debug, expect.stringContaining('stdout: '));
  });
});
