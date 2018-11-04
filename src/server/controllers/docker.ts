import { Request, Response, Router } from "express";
import * as URL from "url";
import { IConnectRequest } from "../../common/models/IConnectRequest";
import { IConnectResponse } from "../../common/models/IConnectResponse";
import { Dependencies } from "../dependencyManager";
import { getContainerDefinitions } from "../utils/containerDefinitions";
import { DockerHelper } from "../utils/dockerHelper";
import { GitMinioSync } from "../utils/gitMinioSync";

const router: Router = Router();

const localSocket = "/var/run/docker.sock";
const windowsSocket = "//./pipe/docker_engine";
const minioAccessKey = "testaccesskey";
const minioSecretKey = "testsecretkey";
const bucketName = "builds";
const sampleContentUrl = "https://github.com/homelabaas/haas-content.git";
let connectionSettings: IConnectRequest = null;

router.post("/run", async (req: Request, res: Response) => {
    try {
        const docker = new DockerHelper(connectionSettings);
        const socketManager = Dependencies().SocketManager;
        let minioAddress = "";
        let postgresAddress = "";
        if (connectionSettings.Type === "dockerwindows" || connectionSettings.Type === "dockermac") {
            minioAddress = "localhost";
            postgresAddress = "host.docker.internal";
        } else if (connectionSettings.Type === "docker") {
            minioAddress = "host.docker.internal";
            postgresAddress = "host.docker.internal";
        } else if (connectionSettings.Type === "dockertarget") {
            const address = URL.parse(connectionSettings.Address).hostname;
            minioAddress = address;
            postgresAddress = address;
        }
        const gitMinioSync = new GitMinioSync(minioAddress, 9000, minioAccessKey, minioSecretKey,
            bucketName, sampleContentUrl);
        const containersToRun = Object.assign(getContainerDefinitions(postgresAddress, minioAccessKey, minioSecretKey),
            {});
        // Make sure that after minio is installed, we sync contents into the repository
        containersToRun.find((p) => p.Name === "haas_minio").PostInstallRun = gitMinioSync.SyncRepository;
        setImmediate(async () => { await docker.RunContainers(containersToRun,
                socketManager.SendContainerRunUpdate); });
        res.json({ Success: true });
    } catch (err) {
        console.log("Error while trying to run containers.");
        console.log(err);
        res.json({ Success: false, Message: err.message });
    }
});

router.post("/pull", async (req: Request, res: Response) => {
    const docker = new DockerHelper(connectionSettings);
    const socketManager = Dependencies().SocketManager;
    setImmediate(async () => { await docker.PullContainers(getContainerDefinitions("", minioAccessKey, minioSecretKey),
        socketManager.SendContainerPullUpdate); });
    res.json({ Success: true});
});

router.post("/connect", async (req: Request, res: Response) => {
    const connectRequest = req.body as IConnectRequest;
    try {
        const docker = new DockerHelper(connectRequest);
        const dockerList = await docker.CheckList();
        connectionSettings = connectRequest;
        const connectResponse: IConnectResponse = {
            Success: true,
            Message: "Successfully connected."
        };
        res.json(connectResponse);
    } catch (err) {
        const connectResponse: IConnectResponse = {
            Success: false,
            Message: err.message
        };
        res.json(connectResponse);
    }
});

export const DockerController: Router = router;
