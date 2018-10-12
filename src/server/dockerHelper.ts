import * as Docker from "dockerode";

export class DockerHelper {
    public Docker: Docker;

    constructor(type: "socket" | "ip", socket: string, host: string, port: number) {
        if (type === "socket") {
            this.Docker = new Docker({socketPath : socket});
        } else if (type === "ip") {
            this.Docker = new Docker({host, port});
        }
    }

    public CheckList = async () => {
        return await this.Docker.listContainers();
    }

    public PullContainers = async (containers: string[], updateProgress: (progress: any) => void) => {
        // Iterate through all the supplied containers and run Pull
    }

    public Pull = async (repoTag: string, updateProgress: (progress: any) => void) => {
        return new Promise((resolve, reject) => {
            this.Docker.pull(repoTag, function(err, stream) {
                if (err) {
                    reject(err);
                } else {
                    this.Docker.modem.followProgress(stream, onFinished, onProgress);

                    function onFinished(error, output) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(output);
                        }
                    }
                    function onProgress(event) {
                        updateProgress(event);
                    }}
            });
        });
    }
}
