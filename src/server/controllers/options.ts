import { Request, Response, Router } from "express";
import { IDeployment } from "../../common/models/IDeployment";
import { IDeploymentOption } from "../../common/models/IDeploymentOption";

const router: Router = Router();

const deploymentOptions: IDeploymentOption[] = [
    {
        Id: "dockerwindows",
        Description: "Windows",
        ExtendedDescription: "When are running this app on a Windows machine (not Docker for Windows).",
        RequiresTargetInfo: false
    },
    {
        Id: "dockermac",
        Description: "Mac",
        ExtendedDescription: "When are running this app on a Mac (not Docker for Mac).",
        RequiresTargetInfo: false
    },
    {
        Id: "docker",
        Description: "Docker For Mac/Windows",
        ExtendedDescription:
            "When are running this app using Docker for Mac/Windows. This is the standard way to deploy.",
        RequiresTargetInfo: false
    },
    {
        Id: "dockertarget",
        Description: "Another Docker Machine",
        ExtendedDescription: "When have another Docker machine, whose API is available over the network.",
        RequiresTargetInfo: true
    },
];

router.get("/", async (req: Request, res: Response) => {
    try {
        let defaultTarget = "docker";
        if (process.platform === "win32") {
            defaultTarget = "dockerwindows";
        } else if (process.platform === "darwin") {
            defaultTarget = "dockermac";
        }
        const returnInfo: IDeployment = {
            Options: deploymentOptions,
            default: defaultTarget
        };
        res.json(returnInfo);
    } catch (err) {
        res.json({ message: err.message, success: false });
    }
});

export const OptionsController: Router = router;
