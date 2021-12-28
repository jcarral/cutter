const arg = require('arg');
const { calculateBatch, calculateOutputFiles } = require('../utils/files.utils');
const { FLAGS, REQUIRED_FLAGS } = require('./cli.constants');
const CliError = require('./CliError');

/**
 * Validate user options:
 * Required: Input and (file or size)
 */
const validateOptions = (options = {}, required = REQUIRED_FLAGS) => {

    options = options || Object.create(null); //Prevents nulls
    required = required.includes('input') ? required : [...REQUIRED_FLAGS, ...required];

    const missingOptions = required.filter(option => !options[option]);
    
    if (missingOptions.length) {
        throw new CliError(`Missing required options: ${missingOptions.join(', ')}`);
    }

    if(!options.files && !options.size) {
        throw new CliError('Missing required options: --files or --size');
    } else if(options.files && options.size) {
        throw new CliError('Only one of this can be used: --files or --size');
    }
}


/*
 * Removes `--` prefix from object keys
 */
const removePrefixFromObjectKeys = obj => {
    const newObj = Object.create(null);
    Object.keys(obj).forEach(key => newObj[key.replace('--', '')] = obj[key]);
    return newObj;
};

/**
 * Reads user entry and returns object with batch, fileName and expected output files
 */
module.exports.parse = async () => {
    const { _, ...args } = arg(FLAGS);
    const parsedOptions = removePrefixFromObjectKeys(args);

    validateOptions(parsedOptions, REQUIRED_FLAGS);

    const batch = parsedOptions.size ? 
        parsedOptions.size
        : await calculateBatch(parsedOptions.input, parsedOptions.files);

    const outputFiles = parsedOptions.files ? 
        parsedOptions.files
        : await calculateOutputFiles(parsedOptions.input, parsedOptions.size);
    
    return {
        batch,
        outputFiles,
        ...parsedOptions
    };
};