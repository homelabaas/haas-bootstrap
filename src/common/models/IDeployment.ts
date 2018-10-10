import { IDeploymentOption } from "./IDeploymentOption";

export interface IDeployment {
    Options: IDeploymentOption[];
    default: string;
}
