import * as axios from "axios";
import { IConnectRequest } from "../../common/models/IConnectRequest";
import { IConnectResponse } from "../../common/models/IConnectResponse";
import { IDeployment } from "../../common/models/IDeployment";
import { IGenericReturn } from "../../common/models/IGenericReturn";
import { IMigrateRequest } from "../../common/models/IMigrateRequest";

export const getOptions = async () => {
    const returnValue = await axios.default.get("/api/options");
    return returnValue.data as IDeployment;
};

export const connectToDocker = async (request: IConnectRequest) => {
    const returnValue = await axios.default.post("/api/docker/connect", request);
    return returnValue.data as IConnectResponse;
};

export const migrate = async (request: IMigrateRequest) => {
    const returnValue = await axios.default.post("/api/migrate", request);
    return returnValue.data as IGenericReturn;
};

export const pullDockerContainers = async () => {
    const returnValue = await axios.default.post("/api/docker/pull", {});
    return returnValue.data as IGenericReturn;
};

export const runDockerContainers = async (request?: IMigrateRequest) => {
    if (request) {
        const returnValue = await axios.default.post("/api/docker/run", request);
        return returnValue.data as IGenericReturn;
    } else {
        const returnValue = await axios.default.post("/api/docker/run", {});
        return returnValue.data as IGenericReturn;
    }
};
