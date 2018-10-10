import * as Docker from "dockerode";
import { Request, Response, Router } from "express";
import { IConnectRequest } from "../../common/models/IConnectRequest";
import { IConnectResponse } from "../../common/models/IConnectResponse";

const router: Router = Router();

const localSocket = "/var/run/docker.sock";
const windowsSocket = "//./pipe/docker_engine";

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
    // Pull down containers here
});

router.post("/connect", async (req: Request, res: Response) => {
    const connectRequest = req.body as IConnectRequest;
    try {
        let success = false;
        if (connectRequest.Type === "dockerwindows") {
            this.Docker = new Docker({ socketPath: windowsSocket });
            const dockerList = await this.Docker.listContainers();
            success = true;
        } else if (connectRequest.Type === "dockermac") {
            this.Docker = new Docker({ socketPath: localSocket });
            const dockerList = await this.Docker.listContainers();
            success = true;
        } else if (connectRequest.Type === "docker") {
            this.Docker = new Docker({ socketPath: localSocket });
            const dockerList = await this.Docker.listContainers();
            success = true;
        }
        if (success) {
            const connectResponse: IConnectResponse = {
                Success: true,
                Message: "Successfully connected."
            };
            res.json(connectResponse);
        } else {
            const connectResponse: IConnectResponse = {
                Success: false,
                Message: "Unable to connect."
            };
            res.json(connectResponse);
        }
    } catch (err) {
        const connectResponse: IConnectResponse = {
            Success: false,
            Message: err.message
        };
        res.json(connectResponse);
    }
});

export const DockerController: Router = router;
