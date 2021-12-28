const FileUtils = require('../../src/utils/files.utils');

const FILES_PROPERTIES = {
    BIG : {
        FILE_PATH : './tests/files/big',
        EXPECTED_LINES : 555555,
    },
    SMALL: {
        FILE_PATH : './tests/files/small',
        EXPECTED_LINES : 22,
    },
    EMPTY: {
        FILE_PATH : './tests/files/empty',
        EXPECTED_LINES : 0,
    }
};

jest.setTimeout(20000);

describe('When countig lines ', () => {

    describe('and its an empty file ', () => {
        it('should return 0', async () => {
            const response = await FileUtils.countLines(FILES_PROPERTIES.EMPTY.FILE_PATH);

            expect(response).toEqual(FILES_PROPERTIES.EMPTY.EXPECTED_LINES);
        });
    }); 

   
    describe('and its a normal file ', () => {
        it('should return valid number of lines', async () => {
            const response = await FileUtils.countLines(FILES_PROPERTIES.SMALL.FILE_PATH);

            expect(response).toEqual(FILES_PROPERTIES.SMALL.EXPECTED_LINES);
        });
    }); 

    describe('and its a big file', () => {
        it('should return valid number of lines', async () => {
            
            const response = await FileUtils.countLines(FILES_PROPERTIES.BIG.FILE_PATH);

            expect(response).toEqual(FILES_PROPERTIES.BIG.EXPECTED_LINES);
        });
    }); 

    describe('and its an invalid path file ', () => {
        it('should throw an exception', async () => {

            try {
                const response = await FileUtils.countLines('');
                expect(true).toEqual(false);
            } catch(e) {
                //Success!
                expect(e).toEqual(new Error('Invalid path'));
            }

        });
    }); 



});


describe('When calculating batch', () => {

    describe(' and size of each output file is less than file size', () => {
        it('should calculate correctly', async () => {
            //given            
            //when
            const res = await FileUtils.calculateBatch(FILES_PROPERTIES.SMALL.FILE_PATH, 2);

            expect(res).toEqual(11);
        });
    });



    describe(' and size of each output file is bigger than file size', () => {
        it('should return file size', async () => {
            //given            
            //when
            const res = await FileUtils.calculateBatch(FILES_PROPERTIES.SMALL.FILE_PATH, 50);

            expect(res).toEqual(FILES_PROPERTIES.SMALL.EXPECTED_LINES);
        });
    });


    describe(' and size of each output file is zero', () => {
        it('should fail', async () => {
            //given            
            //when
            try {
                await FileUtils.calculateBatch(FILES_PROPERTIES.SMALL.FILE_PATH, 0);
            } catch(e) {
                expect(e).toEqual(new Error('Number of files cannot be zero.'));
            }
        });
    });

    describe(' and no file is provided', () => {
        it('should fail', async () => {
            //when
            try {
                await FileUtils.calculateBatch('', 1);
            } catch(e) {
                expect(e).toEqual(new Error('Invalid path'));
            }
        });
    });

    describe(' and file size is zero', () => {
        it('should fail', async () => {
            //given            
            //when
            try {
                await FileUtils.calculateBatch(FILES_PROPERTIES.EMPTY.FILE_PATH, 1);
            } catch(e) {
                expect(e).toEqual(new Error('Input file is empty.'));
            }
        });
    });
});

describe('When calculating output files', () => {

    describe(' and batch size is less than file size', () => {
        it('should calculate correctly', async () => {
            //given            
            //when
            const res = await FileUtils.calculateOutputFiles(FILES_PROPERTIES.SMALL.FILE_PATH, 11);

            expect(res).toEqual(2);
        });
    });



    describe(' and batch size is bigger than file size', () => {
        it('should return 1', async () => {
            //given            
            //when
            const res = await FileUtils.calculateOutputFiles(FILES_PROPERTIES.SMALL.FILE_PATH, 50);

            expect(res).toEqual(1);
        });
    });


    describe(' and batch size is zero', () => {
        it('should fail', async () => {
            //given            
            //when
            try {
                await FileUtils.calculateOutputFiles(FILES_PROPERTIES.SMALL.FILE_PATH, 0);
            } catch(e) {
                expect(e).toEqual(new Error('Batch size cannot be zero.'));
            }
        });
    });

    describe(' and no file is provided', () => {
        it('should fail', async () => {
            //when
            try {
                await FileUtils.calculateOutputFiles('', 1);
            } catch(e) {
                expect(e).toEqual(new Error('Invalid path'));
            }
        });
    });

    describe(' and file size is zero', () => {
        it('should fail', async () => {
            //given            
            //when
            try {
                await FileUtils.calculateOutputFiles(FILES_PROPERTIES.EMPTY.FILE_PATH, 1);
            } catch(e) {
                expect(e).toEqual(new Error('Input file is empty.'));
            }
        });
    });
});