const arg = require('arg');
const { countLines } = require('./utils')

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

const calculateBatch = async (fileLocation, numberOfFiles) => {
    const linesInFile = await countLines(fileLocation);
    return (linesInFile < numberOfFiles) ?
        1 
        : Math.floor(linesInFile / numberOfFiles);
};

//TODO; VALIDATE
module.exports.parse = async () => {
    const { _, ...args } = arg(FLAGS);
    let parsedOptions = Object.create(null);

    Object.keys(args).forEach(key => parsedOptions[key.replace('--', '')] = args[key]);

    const batch = parsedOptions.size ? 
        parsedOptions.size
        : await calculateBatch(parsedOptions.input, parsedOptions.files);

    return {
        batch,
        ...parsedOptions
    };
};