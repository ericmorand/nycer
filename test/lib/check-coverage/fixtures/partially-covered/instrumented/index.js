const {resolve} = require("path");

const key = resolve('./test/lib/check-coverage/fixtures/partially-covered/sources/index.ts');

let __coverage__ = {};

__coverage__[key] = {
    path: key,
    s: {'0': 1, '1': 0},
    b: {'0': [1], '1': [0]},
    f: {'0': 1, '1': 0},
    branchMap: {},
    statementMap: {
        "0": {
            start: {line: 0, column: 0},
            end: {line: 0, column: 1}
        },
        "1": {
            start: {line: 1, column: 0},
            end: {line: 1, column: 1}
        }
    },
    fnMap: {}
};

