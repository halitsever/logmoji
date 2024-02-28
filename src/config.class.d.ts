declare module 'ConfigClass' {
    interface ConfigOptions {
        timestamp?: boolean;
    }

    class ConfigClass {
        constructor(options: ConfigOptions);

        getConfig(): { timestamp: boolean };
    }

    export = ConfigClass;
}
