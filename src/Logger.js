const chalk = require('chalk');
const loglevel = require('loglevel');
const prefix = require('loglevel-plugin-prefix');
const { isProd } = require('./Util');

const Logger = loglevel.getLogger('DealBot');

// Default LogLevel to passed in, or Debug if Dev, and Info if Prod
const LOG_LEVEL = process.env.LOG_LEVEL || (isProd ? loglevel.levels.INFO : loglevel.levels.TRACE);

const colors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.black.bgYellow,
  ERROR: chalk.white.bgRed,
  CRITICAL: chalk.white.bgRed.bold
};

prefix.reg(loglevel);

// Hack to get Critical on the Logger
const criticalLogger = loglevel.getLogger('CRITICAL ERROR');
criticalLogger.enableAll();

// @ts-ignore
Logger.critical = args => {
  const chosenLogger = isProd ? criticalLogger.error : criticalLogger.trace;

  chosenLogger(args);
};

prefix.apply(Logger, {
  format(level, name, timestamp) {
    return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](level)} ${chalk.green(`${name}`)}`;
  }
});

prefix.apply(criticalLogger, {
  format(_, name, timestamp) {
    return colors.CRITICAL(`[${timestamp}] ${name}:`);
  }
});

// Set Log Level based on configuration
// @ts-ignore
Logger.setLevel(LOG_LEVEL);

module.exports = Logger;
