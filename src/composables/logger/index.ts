import chalk from 'chalk';
import { v4, v6 } from 'uuid';
import _ from 'lodash';

type ILogType = 'info' | 'success' | 'error' | 'warn';
type ILog = {
  message: string | ((ctx: typeof chalk) => string);
  data?: any;
  type: ILogType | `#${string}`;
};

const colorByType = (type: ILog['type']) => {
  if (type == 'info') {
    return chalk.blue;
  } else if (type == 'success') {
    return chalk.green;
  } else if (type == 'error') {
    return chalk.red;
  } else if (type == 'warn') {
    return chalk.yellow;
  } else {
    return chalk.hex(type);
  }
};

type ILogEntry = Pick<ILog, 'data' | 'message'> & Partial<Pick<ILog, 'type'>>;
export const useLogger = (tag: string) => {
  const log = (entry: ILogEntry, showLogs: boolean = true) => {
    const config: ILog = {
      type: 'info',
      ...entry,
    };
    const { message, type, data } = config;
    const uuid = v6();
    const showUuid = _.truncate(uuid.split('').reverse().join(''), { length: 4, omission: '' });
    const showTag = colorByType(type)(`[${tag}/${showUuid}]`);
    const showTagStart = data ? `<${showTag}` : `<${showTag}/>`;
    const showTagEnd = `${showTag}/>`;
    const arrow = chalk.dim.yellow('-->');
    const showMessage =
      typeof message == 'string' ? chalk.italic.white(message) : chalk.italic.white(message(chalk));
    if (showLogs) {
      console.log(`${showTagStart} ${arrow} ${showMessage}\n`);
      if (data) {
        console.log(`${chalk.dim.italic.black(`${'type of data'}:${typeof data}`)}`);
        console.log(data);
        console.log(showTagEnd);
      }
      // console.log();
    }
    return {
      object: config,
      json: JSON.stringify(config, null, 2),
    };
  };
  return {
    log,
  };
};
