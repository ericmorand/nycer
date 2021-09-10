import {instrumentFile} from "./instrument-file";
import {glob} from "glob";
import {FileCoverageData} from "istanbul-lib-coverage";

export const instrument = (pattern: string, destination?: string): Promise<Array<FileCoverageData>> => {
    return new Promise((resolve) => {
        glob(pattern, {
            nodir: true
        }, (error, files) => {
            resolve(Promise.all(files.map((file) => {
                return instrumentFile(file, destination);
            })));
        });
    });
};