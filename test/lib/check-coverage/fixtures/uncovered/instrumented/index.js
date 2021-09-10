const {resolve} = require("path");

const key = resolve('./test/lib/check-coverage/fixtures/uncovered/sources/index.ts');

__coverage__[key] = {
    path: key,
    s: {'0': 0},
    b: {'0': [{}]},
    f: {'0': 0},
    branchMap: {},
    statementMap: {
        "0": {
            start: {line: 0, column: 0},
            end: {line: 0, column: 1}
        }
    },
    fnMap: {}
};

