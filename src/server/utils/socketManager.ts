import * as http from "http";
import * as socketio from "socket.io";
import { ITaskUpdate } from "../../common/models/ITaskUpdate";
import { ContainerPullUpdate, ContainerRunUpdate } from "../../common/socketEventDefinitions";

export class SocketManager {
    public io: socketio.Server;

    constructor(server: http.Server) {
        this.io = socketio(server);
    }

    public SendContainerPullUpdate = (pullDetails: ITaskUpdate) => {
        this.io.emit(ContainerPullUpdate, pullDetails);
    }

    public SendContainerRunUpdate = (runDetails: ITaskUpdate) => {
        this.io.emit(ContainerRunUpdate, runDetails);
    }

}
