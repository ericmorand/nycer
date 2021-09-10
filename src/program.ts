#!/usr/bin/env node
import {checkCoverage} from "./lib/check-coverage";
import {resolve as resolvePath} from "path";
import {createCommand, createArgument, createOption} from "commander";
import {instrument} from "./lib/instrument";
import {ReportOptions} from "istanbul-reports";

const program = createCommand('nycer');

const instrumentCommand = createCommand('instrument')
    .addArgument(
        createArgument('entry', 'the entry')
            .argRequired()
    )
    .addArgument(
        createArgument('destination', 'the entry')
            .argRequired()
    )
    .action((entry, destination) => {
        return instrument(entry, destination).then(() => undefined);
    });

program.addCommand(instrumentCommand);

type CheckCommandOptions = {
    reporters: keyof ReportOptions | Array<keyof ReportOptions>;
    statementsThreshold: number;
    branchesThreshold: number;
    functionsThreshold: number;
    linesThreshold: number;
};

const checkCoverageCommand = createCommand('check-coverage')
    .addArgument(
        createArgument('entry', 'the module to run')
            .argRequired()
    )
    .addArgument(
        createArgument('reference', 'the files to check coverage for, in the form of a glob')
            .argRequired()
    )
    .addOption(
        createOption('-s, --statements-threshold <threshold>', 'statements coverage threshold')
    )
    .addOption(
        createOption('-b, --branches-threshold <threshold>', 'branches coverage threshold')
    )
    .addOption(
        createOption('-f, --functions-threshold <threshold>', 'functions coverage threshold')
    )
    .addOption(
        createOption('-l, --lines-threshold <threshold>', 'lines coverage threshold')
    )
    .addOption(
        createOption('-r, --reporters <reporters...>', 'coverage reporters')
            .default('text')
            .choices([
                'clover',
                'cobertura',
                'html-spa',
                'html',
                'json',
                'json-summary',
                'lcov',
                'lcovonly',
                'none',
                'teamcity',
                'text',
                'text-lcov',
                'text-summary',
            ])
    )
    .action((entry, reference, options: CheckCommandOptions) => {
        const {reporters, statementsThreshold, branchesThreshold, functionsThreshold, linesThreshold} = options;

        return checkCoverage(resolvePath(entry), reference, {
            reporters: Array.isArray(reporters) ? reporters : [reporters],
            thresholds: {
                statements: statementsThreshold,
                branches: branchesThreshold,
                functions: functionsThreshold,
                lines: linesThreshold
            }
        }).then((errors) => {
            if (errors.length > 0) {
                for (let error of errors) {
                    console.error(error);
                }

                process.exitCode = 1;
            }
        });
    });

program.addCommand(checkCoverageCommand);

program.parse();
