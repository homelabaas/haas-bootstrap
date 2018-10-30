import * as sleep from "await-sleep";
import * as Docker from "dockerode";
import * as URL from "url";
import { IConnectRequest } from "../common/models/IConnectRequest";
import { ITaskUpdate } from "../common/models/ITaskUpdate";
import { IDockerContainer } from "./IDockerContainer";
import { PullImageByAddress, PullImageBySocket } from "./pullDockerImage";

const localSocket = "/var/run/docker.sock";
const windowsSocket = "//./pipe/docker_engine";

export class DockerHelper {
    public Docker: Docker;
    public ConnectionType: string;
    public Socket: string;
    public TargetHost: string;
    public TargetProtocol: string;
    public TargetPort: number;

    constructor(connectionRequest: IConnectRequest) {
        this.ConnectionType = connectionRequest.Type;
        if (connectionRequest.Type === "dockerwindows") {
            this.InitSocket(windowsSocket);
        } else if (connectionRequest.Type === "dockermac") {
            this.InitSocket(localSocket);
        } else if (connectionRequest.Type === "docker") {
            this.InitSocket(localSocket);
        } else if (connectionRequest.Type === "dockertarget") {
            this.InitAddress(connectionRequest.Address);
        }
    }

    public InitSocket = (socket) => {
        this.Docker = new Docker({socketPath : socket});
        this.Socket = socket;
    }

    public InitAddress = (address: string) => {
        const parsedUrl = URL.parse(address);
        this.TargetProtocol = parsedUrl.protocol.substr(0, parsedUrl.protocol.length - 1);
        this.TargetHost = parsedUrl.hostname;
        this.TargetPort = +parsedUrl.port;
        this.Docker = new Docker({ protocol: this.TargetProtocol as "http" || "https",
            host: this.TargetHost , port: this.TargetPort});
    }

    public CheckList = async () => {
        return await this.Docker.listContainers();
    }

    public RunContainers = async (containers: IDockerContainer[], updateProgress: (progress: any) => void) => {
        // Iterate through all the supplied containers and run Pull
        try {
            for (const container of containers) {
                updateProgress({
                    Name: container.Container,
                    Description: "Running " + container.Container,
                    InProgress: false,
                    IsFinished: false
                });
            }
            for (const container of containers) {
                updateProgress({
                    Name: container.Container,
                    InProgress: true,
                    IsFinished: false
                });
                const createOptions: Docker.ContainerCreateOptions = {
                    Image: container.Container + ":latest",
                    AttachStdin: false,
                    AttachStdout: false,
                    AttachStderr: false,
                    HostConfig: {
                        PortBindings: {
                        }
                    },
                    Env: []
                };
                for (const portMapping of container.PortMapping) {
                    createOptions.HostConfig.PortBindings[portMapping.container + "/tcp"] =
                        [{
                            HostPort: portMapping.host.toString()
                        }];
                }
                for (const env of container.EnvironmentVars) {
                    createOptions.Env.push(env.key + "=" + env.value);
                }
                if (container.Command) {
                    createOptions.Cmd = container.Command;
                }
                createOptions.HostConfig.Binds = [];
                createOptions.Volumes = {};
                if (container.VolumeMapping) {
                    for (const volumeMapping of container.VolumeMapping) {
                        createOptions.Volumes[volumeMapping.containerVolume] = {};
                        createOptions.HostConfig.Binds
                            .push(`${volumeMapping.containerVolume}:${volumeMapping.hostVolume}`);
                    }
                }
                const containerInfo = await this.Docker.createContainer(createOptions);
                await this.Docker.getContainer(containerInfo.id).start();
                if (container.PostInstallRun) {
                    await sleep(5000);
                    await container.PostInstallRun();
                }
                updateProgress({
                    Name: container.Container,
                    InProgress: false,
                    IsFinished: true
                });
            }
        } catch (err) {
            console.log("Error");
            console.log(JSON.stringify(err));
        }
    }

    public PullContainers = async (containers: IDockerContainer[], updateProgress: (progress: ITaskUpdate) => void) => {
        // Iterate through all the supplied containers and run Pull
        try {
            for (const container of containers) {
                updateProgress({
                    Name: container.Container,
                    Description: "Downloading " + container.Container,
                    InProgress: false,
                    IsFinished: false
                });
            }
            for (const container of containers) {
                updateProgress({
                    Name: container.Container,
                    InProgress: true,
                    IsFinished: false
                });
                if (this.ConnectionType === "dockertarget") {
                    await PullImageByAddress(container.Container,
                        this.TargetProtocol, this.TargetHost, this.TargetPort);
                } else {
                    await PullImageBySocket(container.Container, this.Socket);
                }
                updateProgress({
                    Name: container.Container,
                    InProgress: false,
                    IsFinished: true
                });
            }
        } catch (err) {
            console.log("Error");
            console.log(JSON.stringify(err));
        }
    }
}
