import * as bunyan from "bunyan";
import * as http from "http";
import { SocketManager } from "./socketManager";

class DependencyManager {

    public SocketManager: SocketManager;

    public Initialise = async (server: http.Server,
                               logger: bunyan,
                               logFilePath: string,
                               firstRun: boolean) => {
    this.SocketManager = new SocketManager(server);
    }
}

const dependencyManager: DependencyManager =  new DependencyManager();

// Only ever have one dependency manager
export function Dependencies() {
    return dependencyManager;
}
