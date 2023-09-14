import {ChildProcess, ExecOptions, spawn} from 'child_process';
import log, {LogLevel} from './log';
import verbose from './verbose';
import assert from 'assert';

export type Command = {
  cmd: string;
  options?: ExecOptions;
};

export type ExecuteOptionFlags = {
  printCommand?: boolean;
  printStdout?: boolean;
  printStderr?: boolean;
  allowedCodes?: number[];
};

export class ExecuteOptions {
  public printCommand = verbose();
  public printStdout = verbose();
  public printStderr = verbose();
  public allowedCodes = [0];
}

export default async function executeCommand(
  cmd: string | Command,
  options: ExecuteOptionFlags = new ExecuteOptions()
): Promise<string> {
  function commandArgs(cmdStr: string): [string, string[]] {
    const args = cmdStr.split(' ');
    const cmd = args.shift();
    assert(cmd);
    return [cmd, args];
  }

  let command: ChildProcess;
  let commandString: string;
  const allowedCodes = options.allowedCodes || [0];
  if (typeof cmd === 'string') {
    commandString = cmd;
    command = spawn(...commandArgs(cmd));
  } else {
    commandString = cmd.cmd;
    const args = commandArgs(cmd.cmd);
    command = spawn(...args, cmd.options || {});
  }
  if (options.printCommand) log(LogLevel.Debug, ['command', commandString].join(': '));
  const result: Buffer[] = [];
  const stderr: Buffer[] = [];
  if (command.stdout) {
    command.stdout.addListener('data', data => {
      if (options.printStdout) log(LogLevel.Debug, ['stdout', data.toString('utf-8')].join(': '));
      result.push(data);
    });
  }
  if (command.stderr) {
    command.stderr.addListener('data', data => {
      if (options.printStderr) log(LogLevel.Debug, ['stderr', data.toString('utf-8')].join(': '));
      stderr.push(data);
    });
  }
  return new Promise<string>((resolve, reject) => {
    command.on('close', (code, signal) => {
      if (signal || (code !== null && allowedCodes.includes(code))) {
        if (signal)
          log(
            LogLevel.Warn,
            `Command "${commandString}" killed by signal ${signal}, exited with code ${code}`
          );
        if (code !== 0)
          log(
            LogLevel.Info,
            `Command "${commandString}" exited with code ${code}, but any of [${allowedCodes.join(
              ', '
            )}] is allowed.`
          );
        resolve(result.map(d => d.toString('utf-8')).join(''));
      } else {
        log(LogLevel.Warn, `Command "${commandString}" exited with failure code ${code}`);
        log(LogLevel.Warn, stderr.join(''));
        log(LogLevel.Warn, result.join(''));

        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}
