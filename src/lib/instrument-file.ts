import {createInstrumenter} from "istanbul-lib-instrument";
import {join} from "path";
import {
    fromSource,
    removeMapFileComments,
    fromObject
} from "convert-source-map";
import {readFile, outputFileSync, ensureDirSync} from "fs-extra";
import {FileCoverageData} from "istanbul-lib-coverage";

const instrumenter = createInstrumenter({
    produceSourceMap: true,
    parserPlugins: [
        'typescript'
    ]
} as any);

export const instrumentFile = (path: string, destination?: string): Promise<FileCoverageData> => {
    return readFile(path).then((code) => {
        const sourceMap = fromSource(code.toString());

        return new Promise((resolve) => {
            instrumenter.instrument(code.toString(), path, (error, code) => {
                const sourceMap = instrumenter.lastSourceMap();
                const converter = fromObject(sourceMap);

                code = [
                    removeMapFileComments(code),
                    converter.toComment()
                ].join('\n');

                if (destination) {
                    ensureDirSync(destination);

                    const outputDestination = join(destination, path);

                    outputFileSync(outputDestination, code);
                }

                resolve(instrumenter.lastFileCoverage());
            }, sourceMap?.toObject());
        });
    });
};



