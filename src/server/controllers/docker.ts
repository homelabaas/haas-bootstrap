import { Request, Response, Router } from "express";
import { IConnectRequest } from "../../common/models/IConnectRequest";
import { IConnectResponse } from "../../common/models/IConnectResponse";
import { Dependencies } from "../dependencyManager";
import { DockerHelper } from "../dockerHelper";

const router: Router = Router();

const localSocket = "/var/run/docker.sock";
const windowsSocket = "//./pipe/docker_engine";

const containers = ["postgres", "minio/minio", "homelabaas/haas-application"];

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
    // Run containers here
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
