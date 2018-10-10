import * as axios from "axios";
import { IConnectRequest } from "../../common/models/IConnectRequest";
import { IConnectResponse } from "../../common/models/IConnectResponse";
import { IDeployment } from "../../common/models/IDeployment";

export const getOptions = async () => {
    const returnValue = await axios.default.get("/api/options");
    return returnValue.data as IDeployment;
};

export const connectToDocker = async (request: IConnectRequest) => {
    const returnValue = await axios.default.post("/api/docker/connect", request);
    return returnValue.data as IConnectResponse;
};
