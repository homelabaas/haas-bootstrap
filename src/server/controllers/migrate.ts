import { Request, Response, Router } from "express";
import { Client } from "pg";
import { IConnectResponse } from "../../common/models/IConnectResponse";
import { IMigrateRequest } from "../../common/models/IMigrateRequest";

const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
    const migrateRequest = req.body as IMigrateRequest;
    try {
        const pgClient = new Client({
            user: migrateRequest.user,
            host: migrateRequest.address,
            database: migrateRequest.db,
            password: migrateRequest.password,
            port: migrateRequest.port,
          });
        await pgClient.connect();
        const result = await pgClient.query("SELECT count(*) FROM \"VirtualMachine\"");
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

export const MigrateController: Router = router;
