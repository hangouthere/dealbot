const chalk = require('chalk');
const Logger = require('-/Logger');
const { NormalizeToArrayIfPossible } = require('-/Util');
// Must be relative path for runtime loading eval

const regexMatches = /[\?\^\$\*\/]/g;

const doesItemContain = (item, contain) => {
  // Handle injected RegExp's
  if (contain instanceof RegExp) {
    return contain.test(item);
  }

  // Assuming it's a string at this point...

  const isRegexString = regexMatches.test(contain);

  // Handle injected strings that should be RegExp's
  if (isRegexString) {
    return new RegExp(contain, 'ig').test(item);
  }

  return item.includes(contain);
};

const checkList = (checkInList, haystack) => {
  if (0 === checkInList.length) {
    return false;
  }

  return checkInList.find(term => {
    return doesItemContain(haystack, term) ? term : false;
  });
};

const PREDICATE = (ComplexSearchSettings, entry) => {
  const search = `${entry.title} ${entry.content}`.toLowerCase();

  let term = checkList(ComplexSearchSettings.blacklist, search);

  if (term) {
    Logger.info(chalk.red(`Blacklisted: [Term: "${term}"]`) + ` > ${entry.title}`);
    return false;
  }

  term = checkList(ComplexSearchSettings.whitelist, search);

  if (!term) {
    Logger.info(chalk.yellow('No Terms Matched') + ` > ${entry.title}`);
    return false;
  }

  return term;
};

const ComplexSearch = ComplexSearchSettings => {
  const isString = typeof ComplexSearchSettings === 'string';
  const isArray = Array.isArray(ComplexSearchSettings);

  if (isString || isArray) {
    ComplexSearchSettings = {
      whitelist: NormalizeToArrayIfPossible(ComplexSearchSettings)
    };
  }

  // Normalize the Blacklist/Whitelist entries to be an array of strings
  ComplexSearchSettings.blacklist = NormalizeToArrayIfPossible(ComplexSearchSettings.blacklist);
  ComplexSearchSettings.whitelist = NormalizeToArrayIfPossible(ComplexSearchSettings.whitelist);

  return PREDICATE.bind(null, ComplexSearchSettings);
};

module.exports = ComplexSearch;
