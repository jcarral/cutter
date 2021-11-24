const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const getFilePath = fileName => path.isAbsolute(fileName) ? fileName : path.join(process.cwd(), fileName);
const isWin = () => process.platform === "win32";

const countLines = async fileLocation => {

    const command = isWin() ?
        `TYPE ${getFilePath(fileLocation)} | FIND /c /v ""` 
        : `cat ${getFilePath(fileLocation)} | wc -l`;

    const { stdout } = await exec(command);

    return parseInt(stdout);
};


module.exports = {
    getFilePath,
    countLines
};