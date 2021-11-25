const cli = require('./cli');
const cutter = require('./cutter');


const help = () => console.log(`
Usage: cutter-files [--input|-i] <fileName> [--files|-f] <numberOfFiles> [--size|-s] <sizeOfFiles>
    Ex:
        cutter-files -i file.txt -f 10
`)


const main = async ()  => {
    try {
        const { input : fileName, batch } = await cli.parse();
            
        cutter.cut({ fileName, batch });
        
    } catch(e) {
        help();
    }
   
};

module.exports.main = main;