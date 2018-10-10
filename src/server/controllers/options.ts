import { Request, Response, Router } from "express";
import { IDeployment } from "../../common/models/IDeployment";
import { IDeploymentOption } from "../../common/models/IDeploymentOption";

const router: Router = Router();

const deploymentOptions: IDeploymentOption[] = [
    {
        Id: "dockerwindows",
        Description: "Docker for Windows"
    },
    {
        Id: "dockermac",
        Description: "Docker for Mac"
    },
    {
        Id: "docker",
        Description: "Docker Target"
    },
    {
        Id: "compose",
        Description: "Docker Compose File"
    }
];

router.get("/", async (req: Request, res: Response) => {
    try {
        const returnInfo: IDeployment = {
            Options: deploymentOptions,
            default: "dockermac"
        };
        res.json(returnInfo);
    } catch (err) {
        res.json({ message: err.message, success: false });
    }
});

export const OptionsController: Router = router;
