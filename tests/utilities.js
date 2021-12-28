const fse = require('fs-extra');

module.exports.createEmptyFile = (filePath, n = 1) => new Promise((resolve, reject) => {
    let stream = fse.createWriteStream(filePath, { flags : 'a' });
    [...Array(n)].forEach((item, idx) => stream.write(`Line ${idx} \n`));
    stream.end();
    stream.close();

    stream.on('close', () => resolve());
    stream.on('error', e => reject(e));
});

module.exports.filesWithPrefix = (dir, prefix) => fse.readdirSync(dir).filter(name => name.startsWith(prefix));