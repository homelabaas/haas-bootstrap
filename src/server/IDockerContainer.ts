export interface IDockerContainer {
    Container: string;
    EnvironmentVars: Array<{ key: string, value: string}>;
    PortMapping: Array<{ host: number, container: number}>;
    VolumeMapping?: Array<{ hostVolume: string, containerVolume: string }>;
    Command?: string[];
    PostInstallRun?: () => Promise<void>;
}
