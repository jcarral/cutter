const arg = require('arg');

const FLAGS = {
    '--input': String,
    '--output': String,
    '--size': Number,
    '--files': Number,

    '-i': '--input',
    '-o': '--output',
    '-s': '--size',
    '-f': '--files',
};

module.exports.parse = () => {
    const { _, ...args } = arg(
        FLAGS
    );
    let parsedOptions = {};
    Object.keys(args).forEach(key => parsedOptions[key.replace('--', '')] = args[key]);
    return parsedOptions;
};