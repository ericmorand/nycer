import {checkCoverage} from "../../../src";
import * as tape from "tape";
import {resolve} from "path";

tape('checkCoverage', ({test}) => {
    test('handle unmet thresholds', ({same, end}) => {
        return checkCoverage(
            resolve('./test/lib/check-coverage/fixtures/uncovered/instrumented/index.js'),
            'test/lib/check-coverage/fixtures/uncovered/sources/index.ts',
            {
                reporters: ['none'],
                thresholds: {
                    statements: 100,
                    branches: 100,
                    functions: 100,
                    lines: 100
                }
            }
        ).then((errors) => {
            same(errors, [
                'Coverage for statements (0%) does not meet global threshold (100%)',
                'Coverage for branches (0%) does not meet global threshold (100%)',
                'Coverage for functions (0%) does not meet global threshold (100%)',
                'Coverage for lines (0%) does not meet global threshold (100%)'
            ]);

            end();
        });
    });

    test('handle met thresholds', ({same, end}) => {
        return checkCoverage(
            resolve('./test/lib/check-coverage/fixtures/covered/instrumented/index.js'),
            'test/lib/check-coverage/fixtures/covered/sources/index.ts',
            {
                reporters: ['none'],
                thresholds: {
                    statements: 100,
                    branches: 100,
                    functions: 100,
                    lines: 100
                }
            }
        ).then((errors) => {
            same(errors, []);

            end();
        });
    });

    test('handle partially-met thresholds', ({same, end}) => {
        return checkCoverage(
            resolve('./test/lib/check-coverage/fixtures/partially-covered/instrumented/index.js'),
            'test/lib/check-coverage/fixtures/partially-covered/sources/index.ts',
            {
                reporters: ['none'],
                thresholds: {
                    statements: 100,
                    branches: 100,
                    functions: 100,
                    lines: 100
                }
            }
        ).then((errors) => {
            same(errors, [
                'Coverage for statements (50%) does not meet global threshold (100%)',
                'Coverage for branches (50%) does not meet global threshold (100%)',
                'Coverage for functions (50%) does not meet global threshold (100%)',
                'Coverage for lines (50%) does not meet global threshold (100%)'
            ]);

            end();
        });
    });
});

