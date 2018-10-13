import * as Docker from "dockerode";
import { IConnectRequest } from "../common/models/IConnectRequest";
import { IDockerContainer } from "./IDockerContainer";
import { PullImage } from "./pullDockerImage";

const localSocket = "/var/run/docker.sock";
const windowsSocket = "//./pipe/docker_engine";

export class DockerHelper {
    public Docker: Docker;
    public Socket: string;

    constructor(connectionRequest: IConnectRequest) {
        if (connectionRequest.Type === "dockerwindows") {
            this.Init("socket", windowsSocket);
        } else if (connectionRequest.Type === "dockermac") {
            this.Init("socket", localSocket);
        } else if (connectionRequest.Type === "docker") {
            this.Init("socket", localSocket);
        }
    }

    public Init(type: "socket" | "ip", socket?: string, host?: string, port?: number) {
        if (type === "socket") {
            this.Docker = new Docker({socketPath : socket});
            this.Socket = socket;
        } else if (type === "ip") {
            this.Docker = new Docker({host, port});
        }
    }

    public CheckList = async () => {
        return await this.Docker.listContainers();
    }

    public RunContainers = async (containers: IDockerContainer[], updateProgress: (progress: any) => void) => {
        // Iterate through all the supplied containers and run Pull
        try {
            for (const container of containers) {
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
                const containerInfo = await this.Docker.createContainer(createOptions);
                await this.Docker.getContainer(containerInfo.id).start();
            }
        } catch (err) {
            console.log("Error");
            console.log(JSON.stringify(err));
        }
    }

    public PullContainers = async (containers: IDockerContainer[], updateProgress: (progress: any) => void) => {
        // Iterate through all the supplied containers and run Pull
        try {
            for (const container of containers) {
                updateProgress({container: container.Container, percent: 0});
            }
            for (const container of containers) {
                await PullImage(container.Container, this.Socket);
                updateProgress({container: container.Container, percent: 100});
            }
        } catch (err) {
            console.log("Error");
            console.log(JSON.stringify(err));
        }
    }
}
