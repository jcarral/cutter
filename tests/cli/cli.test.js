const rewire = require('rewire');
const cli = require('../../src/cli');
const CliError = require('../../src/cli/CliError');

const rewiredCli = rewire('../../src/cli/');

const callCli = fnName => rewiredCli.__get__(fnName);

describe('When validating options ', () => {

    const validateOptions = callCli('validateOptions');

    describe('and object has required fields and size', () => {
        it('should not fail', () => {
            validateOptions({ input: 1, size: 1 }, ['input']);
        });
    });

    describe('and object has required fields and files', () => {
        it('should not fail', () => {
            validateOptions({ input: 1, files: 1 }, ['input']);
        });
    });

    describe('and object has required fields but sizes and files', () => {
        it('should fail requesting only one of the required', () => {
            expect(() => validateOptions({ input: 1, files: 1, size: 2 }, ['input']))
                .toThrow(new CliError('Only one of this can be used: --files or --size'));
        });
    });

    describe('and object has required fields but not sizes', () => {
        it('should fail requesting for size or files', () => {
            expect(() => validateOptions({ input: 1 }, ['input']))
                .toThrow(new CliError('Missing required options: --files or --size'));
        });
    });

    describe('and object has required field but null', () => {
        it('should fail requesting for input', () => {
            expect(() => validateOptions({ input: null }, ['input']))
                .toThrow(new CliError('Missing required options: input'));
        });
    });

    describe('and object input is empty and multiple required fields', () => {
        it('should fail requesting for all fields', () => {
            expect(() => validateOptions({}, ['input', 'input2']))
                .toThrow(new CliError('Missing required options: input, input2'));
        });
    });

    describe('and object input is empty but not required fields', () => {
        it('should fail requesting for input anyways', () => {
            expect(() => validateOptions({}, []))
                .toThrow(new CliError('Missing required options: input'));
        });
    });

    describe('and object input is empty', () => {
        it('should throw CliError', () => {
            expect(() => validateOptions({}))
                .toThrow(new CliError('Missing required options: input'));
        });
    });

    describe('and object input is null', () => {
        it('should throw CliError', () => {
            expect(() => validateOptions(null))
                .toThrow(new CliError('Missing required options: input'));
        });
    });

});



describe('When parsing arg object ', () => {

    const INPUT_WITH_PREFIXES = {
        '--test': 1,
        '--test2': 2,
    };

    const INPUT_WITHOUT_PREFIXES = {
        test: 1,
        test2: 2,
    };

    const removePrefixFromObjectKeys = callCli('removePrefixFromObjectKeys');

    describe('and entry object has keys with prefixes ', () => {
        it('should return an empty object', () => {

            const response = removePrefixFromObjectKeys(INPUT_WITH_PREFIXES);

            expect(response).not.toBeNull();
            expect(Object.keys(response)).toEqual(Object.keys(INPUT_WITHOUT_PREFIXES));
            expect(response).toEqual(INPUT_WITHOUT_PREFIXES);
        }); 
    });


    describe('and entry object has not keys with prefixes ', () => {
        it('should return an empty object', () => {

            const response = removePrefixFromObjectKeys(INPUT_WITHOUT_PREFIXES);

            expect(response).not.toBeNull();
            expect(Object.keys(response)).toEqual(Object.keys(INPUT_WITHOUT_PREFIXES));
            expect(response).toEqual(INPUT_WITHOUT_PREFIXES);
        }); 
    });

    describe('and entry object is empty ', () => {
        it('should return an empty object', () => {
            const response = removePrefixFromObjectKeys(Object.create(null));

            expect(response).not.toBeNull();
            expect(Object.keys(response).length).toEqual(0);
        }); 
    });


    describe('and entry object is null ', () => {
        it('should return an empty object', () => {
            const response = removePrefixFromObjectKeys(Object.create(null));

            expect(response).not.toBeNull();
            expect(Object.keys(response).length).toEqual(0);
        }); 
    });

});