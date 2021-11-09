const meow = require('meow');
const { RunCommandName } = require('./Util');

module.exports = () =>
  meow(`
    Usage:
        $ ${RunCommandName}

    Options:
        --import, -i                    - Run Import process against Source Descriptors found on disk.
        --notify, -n                    - Run Notify process against Entries from previous Feed Scans.
        --clear,  -c                    - Clear ALL Data to reset all processing.
        --prune=<mode>, -p <mode>       - Prune existing Entries by mode: keepmin, errored, reports
        --report=<mode>, -r <mode>      - Stats that inform the owner about processing feeds: period, compare

    Environment Variables:
        LOG_LEVEL                       - Set the output Log Level (default: info, choices: debug, info, warn, silent)
        PATH_DESCRIPTORS_BASE           - Path to directory for Source/Destination Descriptors base directory (default: './junction')
        DESCRIPTOR_EXTENSIONS           - Extensions to parse in PATH_DESCRIPTORS_BASE (default: '.js .json'),
                                          include full '.ext' and space separated.

    Examples
        $ ${RunCommandName} --import
        $ ${RunCommandName} -n
        $ ${RunCommandName} --clear
`);
