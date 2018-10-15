import { Request, Response, Router } from "express";
import { IConnectRequest } from "../../common/models/IConnectRequest";
import { IConnectResponse } from "../../common/models/IConnectResponse";
import { Dependencies } from "../dependencyManager";
import { DockerHelper } from "../dockerHelper";
import { GitMinioSync } from "../gitMinioSync";
import { IDockerContainer } from "../IDockerContainer";

const router: Router = Router();

const localSocket = "/var/run/docker.sock";
const windowsSocket = "//./pipe/docker_engine";
const minioAccessKey = "testaccesskey";
const minioSecretKey = "testsecretkey";
const bucketName = "builds";
const sampleContentUrl = "https://github.com/homelabaas/haas-content.git";

const containers: IDockerContainer[] = [
    {
        Container: "postgres",
        EnvironmentVars: [
            {
                key: "POSTGRES_PASSWORD",
                value: "devpostgrespwd"
            }
        ],
        PortMapping: [
            {
                container: 5432,
                host: 5432
            }
        ]
    },
    {
        Container: "minio/minio",
        EnvironmentVars: [
            {
                key: "MINIO_ACCESS_KEY",
                value: minioAccessKey
            },
            {
                key: "MINIO_SECRET_KEY",
                value: minioSecretKey
            }
        ],
        PortMapping: [
            {
                container: 9000,
                host: 9000
            }
        ],
        Command: ["server", "/data"]
    },
    {
        Container: "homelabaas/haas-application",
        EnvironmentVars: [
            {
                key: "NODE_CONFIG",
                value : "{\"Database\":{ \"ConnectionString\":\"postgres://postgres:devpostgrespwd@host.docker.internal:5432/\"}}"
            }
        ],
        PortMapping: [
            {
                container: 3000,
                host: 3000
            }
        ]
    }
];

let connectionSettings: IConnectRequest = null;

router.get("/", async (req: Request, res: Response) => {
    try {
        res.json({});
    } catch (err) {
        res.json({ message: err.message, success: false });
    }
});

router.get("/composefile", async (req: Request, res: Response) => {
    // Return a sample compose file here to download
});

router.post("/run", async (req: Request, res: Response) => {
    try {
        const docker = new DockerHelper(connectionSettings);
        const socketManager = Dependencies().SocketManager;
        const gitMinioSync = new GitMinioSync("localhost", 9000, minioAccessKey, minioSecretKey,
            bucketName, sampleContentUrl);
        const containersToRun = Object.assign(containers, {});
        // Make sure that after minio is installed, we sync contents into the repository
        containersToRun.find((p) => p.Container === "minio/minio").PostInstallRun = gitMinioSync.SyncRepository;
        setImmediate(async () => { await docker.RunContainers(containers, socketManager.SendContainerRunUpdate); });
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
    setImmediate(async () => { await docker.PullContainers(containers, socketManager.SendContainerPullUpdate); });
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
