import * as socketio from "socket.io-client";
import { ITaskUpdate } from "../common/models/ITaskUpdate";
import { ContainerPullUpdate, ContainerRunUpdate } from "./../common/socketEventDefinitions";

class SocketManager {
    public Connection: SocketIOClient.Socket;

    constructor() {
        this.Connection = socketio.connect();
    }

    public startContainerPullUpdateReceive = (receiveFunction: (data: ITaskUpdate) => void) => {
        this.Connection.on(ContainerPullUpdate, receiveFunction);
    }

    public stopContainerPullUpdateReceive = () => {
        this.Connection.off(ContainerPullUpdate);
    }

    public startContainerRunUpdateReceive = (receiveFunction: (data: ITaskUpdate) => void) => {
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
