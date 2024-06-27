interface ILogSymbols {
    success: string;
    fail: string;
    error: string;
    info: string;
    warn: string;
    log: string;
}

export interface ConfigOptions {
    timestamp?: false | true
    disablePrefixText?: false | true
    logSymbols?: ILogSymbols
}