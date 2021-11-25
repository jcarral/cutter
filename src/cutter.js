const fs = require('fs');

const { getFilePath } = require('./utils')

const cut = ({ fileName, batch }) => new Promise((reject, resolve) => {

    let createdFiles = 1;
    let lineCount = 0;
    let outputFileName = `${fileName}.${createdFiles}`;

    let inStream = fs.createReadStream(getFilePath(fileName));
    let outStream = fs.createWriteStream(getFilePath(outputFileName))
    const lineReader = require('readline').createInterface({ input: inStream });


    const createNewFile = () => {
        createdFiles++;
        outStream.close();
        outputFileName = `${fileName}.${createdFiles}`;
        outStream = fs.createWriteStream(getFilePath(outputFileName));
        lineCount = 0;

    };

    const onReadLine = line => {
        lineCount++;
        lineReader.pause();
        outStream.write(`${line}\n`);
        if(lineCount>=batch) {
            createNewFile();
        }
        lineReader.resume();
    };

    const onCloseStream = () => {
        inStream.close();
        outStream.close();
        resolve();
    };

    lineReader.on('line', onReadLine);
    lineReader.on('close', onCloseStream);

});

module.exports.cut = cut;