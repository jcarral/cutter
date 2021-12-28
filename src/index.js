const cli = require('./cli/');
const cutter = require('./cutter');


const help = () => console.log(`
Usage: cutter-files [--input|-i] <fileName> [--files|-f] <numberOfFiles> [--size|-s] <sizeOfFiles>
    Ex:
        cutter-files -i file.txt -f 10
`)


const main = async ()  => {
    try {
        const { input : fileName, batch, outputFiles } = await cli.parse();
            
        await cutter.cut({ fileName, batch, outputFiles });
        console.log(`SUCCESS!! ${outputFiles} filescreated`);
    } catch(e) {
        help();
        console.error(e.message);
    }
   
};

module.exports.main = main;