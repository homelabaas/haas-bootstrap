export interface IDockerContainer {
    Container: string;
    EnvironmentVars: Array<{ key: string, value: string}>;
    PortMapping: Array<{ host: number, container: number}>;
    Command?: string[];
    PostInstallRun?: () => Promise<void>;
}
