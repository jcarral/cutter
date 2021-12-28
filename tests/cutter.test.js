const os = require('os');
const path = require('path');
const fse = require('fs-extra');

const cutter = require('../src/cutter');
const { createEmptyFile, filesWithPrefix } = require('./utilities');

jest.setTimeout(60000);

describe('When spliting files', () => {

    let TEST_DIR;
    let TEST_FILES = Object.create(null);

    const writeLines = async (fileName, n = 1) => {
        const tmpFilePath = path.join(TEST_DIR, fileName);
        await createEmptyFile(tmpFilePath, n);
        return tmpFilePath;
    };

    beforeAll(async () => {
        TEST_DIR = path.join(os.tmpdir(), 'cutter');
        fse.emptyDirSync(TEST_DIR);
        TEST_FILES['med_odd'] = await writeLines('med_odd', 55);
        TEST_FILES['med_even'] = await writeLines('med_even', 54);

        TEST_FILES['big_odd'] = await writeLines('big_odd', 55555);
        TEST_FILES['big_even'] = await writeLines('big_even', 55554);

    });

    afterAll(() => {
        fse.remove(TEST_DIR);
    });

    describe('and file its not valid', () => {
        it('should fail', async () => {
            try {
                await cutter.cut();
            } catch(e) {
                expect(e).toEqual(new Error('Invalid input file'));
            }
        });
    });

    describe('and file is valid', () => {
        it('should create 2 files on even', async () => {
            await cutter.cut({ fileName: TEST_FILES['med_even'], batch: 14, outputFiles: 4 });
            const createdFiles = filesWithPrefix(TEST_DIR, 'med_even.');
            expect(createdFiles.length).toEqual(4);
        });

        it('should create 2 files on odd', async () => {
            await cutter.cut({ fileName: TEST_FILES['med_odd'], batch: 28, outputFiles: 2 });
            const createdFiles = filesWithPrefix(TEST_DIR, 'med_odd.');
            expect(createdFiles.length).toEqual(2);
        });
    });

    describe('and file is valid but file count not specified', () => {
        it('should create 39683 files on even', async () => {
            await cutter.cut({ fileName: TEST_FILES['big_even'], batch: 14 });
            const createdFiles = filesWithPrefix(TEST_DIR, 'big_even.');
            expect(createdFiles.length).toEqual(3969);
        });

        it('should create 2 files on odd', async () => {
            await cutter.cut({ fileName: TEST_FILES['big_odd'], batch: 29 });
            const createdFiles = filesWithPrefix(TEST_DIR, 'big_odd.');
            expect(createdFiles.length).toEqual(1916);
        });
    });

});