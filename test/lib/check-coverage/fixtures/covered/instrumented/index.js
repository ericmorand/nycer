const {resolve} = require("path");

const key = resolve('./test/lib/check-coverage/fixtures/covered/sources/index.ts');

let __coverage__ = {};

__coverage__[key] = {
    path: key,
    s: {'0': 1},
    b: {'0': [1]},
    f: {'0': 1},
    branchMap: {},
    statementMap: {},
    fnMap: {}
};

