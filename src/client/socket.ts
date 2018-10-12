import * as socketio from "socket.io-client";
import { IContainerPullInfo } from "./../common/models/IContainerPullInfo";
import { IContainerRunInfo } from "./../common/models/IContainerRunInfo";
import { ContainerPullUpdate, ContainerRunUpdate } from "./../common/socketEventDefinitions";

class SocketManager {
    public Connection: SocketIOClient.Socket;

    constructor() {
        this.Connection = socketio.connect();
    }

    public startContainerPullUpdateReceive = (receiveFunction: (data: IContainerPullInfo) => void) => {
        this.Connection.on(ContainerPullUpdate, receiveFunction);
    }

    public stopContainerPullUpdateReceive = () => {
        this.Connection.off(ContainerPullUpdate);
    }

    public startContainerRunUpdateReceive = (receiveFunction: (data: IContainerRunInfo) => void) => {
        this.Connection.on(ContainerRunUpdate, receiveFunction);
    }

    public stopContainerRunUpdateReceive = () => {
        this.Connection.off(ContainerRunUpdate);
    }
}

const socketManager: SocketManager =  new SocketManager();

// Only ever have one dependency manager
export function Sockets() {
    return socketManager;
}
