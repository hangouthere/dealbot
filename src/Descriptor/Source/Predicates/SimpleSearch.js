const chalk = require('chalk');
// Must be relative path for runtime loading eval
const Logger = require('../../../Logger');

const PREDICATE = (SimpleSearchSettings, entry) => {
  const search = `${entry.title} ${entry.content}`.toLowerCase();

  if (SimpleSearchSettings.blacklist.length) {
    const isBlacklisted = SimpleSearchSettings.blacklist.some(term => {
      const _isBL = !term ? false : search.includes(term);

      if (_isBL) {
        Logger.debug(chalk.red(`Blacklisted: [Term: "${term}"]`) + ` > ${entry.title}`);
      }

      return _isBL;
    });

    if (isBlacklisted) {
      return false;
    }
  }

  const isWhitelisted = SimpleSearchSettings.whitelist.some(term => {
    const _isIn = search.includes(term);

    if (_isIn) {
      Logger.debug(chalk.green(`Included: [Term: "${term}"]`) + ` > ${entry.title}`);
    }

    return _isIn;
  });

  if (!isWhitelisted) {
    Logger.debug(chalk.yellow('No Terms Matched') + ` > ${entry.title}`);
  }

  return isWhitelisted;
};

const SimpleSearch = SimpleSearchSettings => PREDICATE.bind(null, SimpleSearchSettings);

module.exports = SimpleSearch;
