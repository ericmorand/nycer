import {CoverageMapData, CoverageSummary} from "istanbul-lib-coverage";
import {createContext, Watermarks} from "istanbul-lib-report";
import {createCoverageMap} from "istanbul-lib-coverage";
import {create, ReportOptions} from "istanbul-reports";
import {createSourceMapStore} from "istanbul-lib-source-maps";
import {instrumentFile} from "./instrument-file";
import {glob} from "glob";

type CheckCoverageOptions = {
    reporters: Array<keyof ReportOptions>,
    thresholds?: {
        statements?: number,
        branches?: number,
        functions?: number,
        lines?: number
    }
};

const check = (summary: CoverageSummary, thresholds: Watermarks): Array<string> => {
    const keys = Object.keys(thresholds) as (keyof Watermarks)[]
    const errors: Array<string> = [];

    for (let key of keys) {
        const percentage = summary[key].pct;
        const [threshold] = thresholds[key];

        if (percentage < threshold) {
            errors.push(`Coverage for ${key} (${percentage}%) does not meet global threshold (${threshold}%)`);
        }
    }

    return errors;
};

const createWatermarks = (thresholds: CheckCoverageOptions["thresholds"]): Watermarks => {
    const lines = thresholds?.lines || 0;
    const branches = thresholds?.branches || 0;
    const functions = thresholds?.functions || 0;
    const statements = thresholds?.statements || 0;

    return {
        statements: [statements, statements],
        branches: [branches, branches],
        functions: [functions, functions],
        lines: [lines, lines]
    };
};

export const checkCoverage = (entry: string, reference: string, options: CheckCoverageOptions): Promise<Array<string>> => {
    const {reporters, thresholds} = options;
    const sourceMapStore = createSourceMapStore();

    let __coverage__: undefined | CoverageMapData;

    {
        require(entry);

        console.error(__coverage__);
    }

    const coverageMap = createCoverageMap(__coverage__);

    console.error('>>>', coverageMap);

    return new Promise((resolve) => {
        sourceMapStore.transformCoverage(coverageMap).then((coverageMap) => {
            glob(reference, {
                nodir: true,
                absolute: true
            }, (error, files) => {
                const promises = files.map((file) => {
                    if (coverageMap.files().includes(file)) {
                        return Promise.resolve(coverageMap.fileCoverageFor(file));
                    }

                    return instrumentFile(file);
                });

                resolve(Promise.all(promises).then((fileCoverages) => {
                    const coverageMap = createCoverageMap();

                    for (let fileCoverage of fileCoverages) {
                        coverageMap.addFileCoverage(fileCoverage);
                    }

                    const watermarks: Watermarks = createWatermarks(thresholds);

                    const context = createContext({
                        coverageMap,
                        watermarks
                    });

                    for (let reporter of reporters) {
                        const report = create(reporter, {
                            skipEmpty: false
                        });

                        report.execute(context);
                    }

                    return check(coverageMap.getCoverageSummary(), watermarks);
                }));
            });
        });
    });
};
