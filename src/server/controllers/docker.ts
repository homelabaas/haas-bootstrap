import { Request, Response, Router } from "express";
import { IConnectRequest } from "../../common/models/IConnectRequest";
import { IConnectResponse } from "../../common/models/IConnectResponse";
import { Dependencies } from "../dependencyManager";
import { DockerHelper } from "../dockerHelper";
import { IDockerContainer } from "../IDockerContainer";

const router: Router = Router();

const localSocket = "/var/run/docker.sock";
const windowsSocket = "//./pipe/docker_engine";

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
                value: "testaccesskey"
            },
            {
                key: "MINIO_SECRET_KEY",
                value: "testsecretkey"
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
    const docker = new DockerHelper(connectionSettings);
    const socketManager = Dependencies().SocketManager;
    docker.RunContainers(containers, socketManager.SendContainerRunUpdate);
});

router.post("/pull", async (req: Request, res: Response) => {
    const docker = new DockerHelper(connectionSettings);
    const socketManager = Dependencies().SocketManager;
    docker.PullContainers(containers, socketManager.SendContainerPullUpdate);
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
