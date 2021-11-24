const cli = require('./cli');
const cutter = require('./cutter');


const help = () => console.log(`
    HELP MESSAGE
`);


const main = async ()  => {
    try {
        const { input : fileName, batch } = await cli.parse();
            
        cutter.cut({ fileName, batch });
        
    } catch(e) {
        console.error(e);
        help();
    }
   
};

module.exports.main = main;