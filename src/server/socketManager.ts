import * as http from "http";
import * as socketio from "socket.io";
import { ContainerPullUpdate, ContainerRunUpdate } from "./../common/socketEventDefinitions";

export class SocketManager {
    public io: socketio.Server;

    constructor(server: http.Server) {
        this.io = socketio(server);
    }

    public SendContainerPullUpdate = (pullDetails: any) => {
        this.io.emit(ContainerPullUpdate, pullDetails);
    }

    public SendContainerRunUpdate = (runDetails: any) => {
        this.io.emit(ContainerRunUpdate, runDetails);
    }

}
