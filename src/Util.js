const Logger = require('./Logger');
const chalk = require('chalk');

const Separator = (force = false) => {
  const chosenLogger = force ? Logger.warn : Logger.debug;

  chosenLogger(chalk.blue(new Array(150).fill('-').join('')));
};

const FinalizeAndNormalize = async entries => {
  const promises = await Promise.all(entries);

  // Only return non-null items
  return promises.filter(v => !!v);
};

const NormalizeToArrayIfPossible = inputConfig => {
  if (!inputConfig) return [];

  const configIsArray = Array.isArray(inputConfig);
  const configIsString = typeof inputConfig === 'string';

  if (configIsArray) {
    return inputConfig;
  }

  if (configIsString) {
    return inputConfig.toLowerCase().split(' ');
  }

  return inputConfig;
};

// Detect if we're in a node runtime (vs a binary)
const nodeRuntimes = ['node', 'npx', 'npm'];
const isNodeRuntime = nodeRuntimes.some(runtimeName => process.argv[0].includes(runtimeName));
// Establish the command name based on runtime
const cmdName = isNodeRuntime ? `${process.argv[0]} ${process.argv[1]}` : process.argv[0];

exports.isProd = 'development' !== process.env.NODE_ENV;

exports.Separator = Separator;
exports.FinalizeAndNormalize = FinalizeAndNormalize;
exports.RunCommandName = cmdName;
exports.NormalizeToArrayIfPossible = NormalizeToArrayIfPossible;
