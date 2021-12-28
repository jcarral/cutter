const fs = require('fs');

const { filePath, fileExists, calculateOutputFiles } = require('./utils/files.utils')

const cut = ({ fileName = '', batch, outputFiles } = {}) => new Promise(async (resolve, reject) => {

    if(!fileExists(filePath(fileName))) {
        return reject(new Error('Invalid input file'));
    }

    if(!outputFiles) {
        outputFiles = await calculateOutputFiles(fileName, batch);
    }

    let createdFiles = 0;
    let lineCount = 0;
    let outputFileName = `${fileName}.${createdFiles}`;

    let inStream = fs.createReadStream(filePath(fileName));
    let outStream = null;
    const lineReader = require('readline').createInterface({ input: inStream });

    const createNewFile = () => {
        createdFiles++;
        
        if(outStream) {
            outStream.close();
        }

        if(createdFiles > outputFiles) {
            return; //Prevents creating last empty file
        } 

        outputFileName = `${fileName}.${createdFiles}`;
        outStream = fs.createWriteStream(filePath(outputFileName));
        lineCount = 0;

        if(createdFiles == outputFiles) {
            //Last output stream ends the process.
            outStream.on('close', () => {
                resolve();
            });
        }
    };

    const onReadLine = (line) => {
        lineCount++;
        lineReader.pause();
        outStream.write(`${line}\n`);
        if(lineCount >= batch) {
            createNewFile();
        }
        lineReader.resume();
    };

    const onCloseStream = () => {
        inStream.close();
        outStream.close();
    };

    createNewFile();
    lineReader.on('line', onReadLine);
    lineReader.on('close', onCloseStream);
});

module.exports.cut = cut;