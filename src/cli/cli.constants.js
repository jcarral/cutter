module.exports.FLAGS = {
    '--input': String,
    '--size': Number,
    '--files': Number,

    '-i': '--input',
    '-s': '--size',
    '-f': '--files',
};

module.exports.REQUIRED_FLAGS = [
    'input'
];
