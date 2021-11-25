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

const REQUIRED_FLAGS = ['input'];

const calculateBatch = async (fileLocation, numberOfFiles) => {
    const linesInFile = await countLines(fileLocation);
    return (linesInFile < numberOfFiles) ?
        1 
        : Math.floor(linesInFile / numberOfFiles);
};

const getBatch = async options => options.size ? 
    options.size
    : await calculateBatch(options.input, options.files);


const validateOptions = (options, required = ['input', 'output']) => {
    const missingOptions = required.filter(option => !options[option]);
    
    if (missingOptions.length) {
        throw new Error(`Missing required options: ${missingOptions.join(', ')}`);
    }

    if(!options.files && !options.size) {
        throw new Error('Missing required options: --files or --size');
    }
}

const removePrefixFromObjectKeys = (obj) => {
    const newObj = Object.create(null);
    Object.keys(obj).forEach(key => newObj[key.replace('--', '')] = obj[key]);
    return newObj;
}

//TODO: VALIDATE
module.exports.parse = async () => {
    const { _, ...args } = arg(FLAGS);
    const parsedOptions = removePrefixFromObjectKeys(args);
    
    validateOptions(parsedOptions, REQUIRED_FLAGS);

    const batch = getBatch(parsedOptions);

    return {
        batch,
        ...parsedOptions
    };
};