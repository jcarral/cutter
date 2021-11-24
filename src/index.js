const cli = require('./cli');
const util = require('util');
const path = require('path');
const fs = require('fs');

const exec = util.promisify(require('child_process').exec);

const fileLineCount = async (fileLocation) => {
    const filePath = path.isAbsolute(fileLocation) ? fileLocation : path.join(__dirname, fileLocation);
    const { stdout } = await exec(`cat ${filePath} | wc -l`);
    return parseInt(stdout);
};

const linesPerFile = async (fileLocation, numberOfFiles) => {
    const linesInFile = await fileLineCount(fileLocation);
    return (linesInFile < numberOfFiles) ?
        1 
        : Math.floor(linesInFile / numberOfFiles);
}


const create = async (fileName, batch) => {
    return new Promise((reject, resolve) => {
        var fileCount = 1;
        var count = 0;
        var outfileName = fileName + '.' + fileCount;
        var inStream = fs.createReadStream(fileName);
        var outStream = fs.createWriteStream(outfileName);
        var lineReader = require('readline').createInterface({
            input: inStream
        });
        
    
        lineReader.on('line', function(line) {
            count++;
            lineReader.pause();
            outStream.write(line + '\n');
            if (count >= batch) {
              fileCount++;
              console.log('file ', outfileName, count);
              outStream.close();
              outfileName = fileName + '.' + fileCount;
              outStream = fs.createWriteStream(outfileName);
              count = 0;
            }
            lineReader.resume();
        });
    
        lineReader.on('close', function() {
            if (count > 0) {
              console.log('Final close:', outfileName, count);
            }
            inStream.close();
            outStream.close();
            console.log('Done');
            resolve('DONE')
          });
    });
};


const main = async ()  => {

    const options = cli.parse();
    
    console.log(options, await linesPerFile('cli.js', 2));
    const lineas = await linesPerFile('cli.js', 2);
    create(path.join(__dirname, 'cli.js'), lineas)
};

module.exports.main = main;