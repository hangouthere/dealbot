const meow = require('meow');
const { RunCommandName } = require('./Util');

module.exports = () => {
  return meow(`
    Usage:
        $ ${RunCommandName}

    Options:
        --import, -i                    - Run Import process against Tracker Descriptors found on disk.
        --notify, -n                    - Run Notify process against Entries from previous Feed Scans.
        --clear,  -c                    - Clear all Entries to stop all current processing.

    Environment Variables:
        LOG_LEVEL                       - Set the output Log Level (Default: info, Choices: debug, info, warn, none)
        PATH_DESCRIPTORS_BASE           - Path to directory for Tracker Descriptors base directory (Default: './trackerDescriptors')
        DESCRIPTOR_EXTENSIONS           - Extensions to parse in PATH_DESCRIPTORS_BASE (Default: '.js .json'),
                                          include full '.ext' and space separated.

    Examples
        $ ${RunCommandName} --import
        $ ${RunCommandName} -n
        $ ${RunCommandName} --clear
`);
};
