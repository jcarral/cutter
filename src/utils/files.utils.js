const path = require('path');
const util = require('util');
const fse = require('fs-extra');

const exec = util.promisify(require('child_process').exec);

/**
 * Check if current SO is windows
 */
const isWin = () => process.platform === "win32";


const fileExists = filePath => fse.existsSync(filePath) && fse.lstatSync(filePath).isFile();

/**
 * Builds file path
 */
const filePath = 
    fileName => path.isAbsolute(fileName) ? fileName : path.join(process.cwd(), fileName);


const countLines = async fileLocation => {
    const pathToFile = filePath(fileLocation);

    if(!fileExists(pathToFile)){
        throw new Error('Invalid path');
    }

    const command = isWin() ?
        `TYPE ${pathToFile} | FIND /c /v ""` 
        : `sed -n '=' ${pathToFile} | wc -l`;

    const { stdout } = await exec(command);
    return parseInt(stdout);
};

const calculateBatch = async (fileLocation, numberOfFiles) => {
    const linesInFile = await countLines(fileLocation);
    
    if(!linesInFile) {
        throw new Error('Input file is empty.');
    } else if(!numberOfFiles) {
        throw new Error('Number of files cannot be zero.');
    }

    return (linesInFile < numberOfFiles) ?
        linesInFile
        : Math.ceil(linesInFile / numberOfFiles);
};

const calculateOutputFiles = async (fileLocation, batchSize) => {
    const linesInFile = await countLines(fileLocation);
    
    if(!linesInFile) {
        throw new Error('Input file is empty.');
    } else if(!batchSize) {
        throw new Error('Batch size cannot be zero.');
    }

    return Math.ceil(linesInFile / batchSize);
};

module.exports = {
    filePath,
    countLines,
    calculateBatch,
    calculateOutputFiles,
    fileExists
};