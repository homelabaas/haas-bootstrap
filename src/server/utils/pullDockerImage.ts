import * as http from "http";
import { IDockerContainer } from "./IDockerContainer";

export function Run(container: IDockerContainer, socketPath: string) {
    return new Promise<any>((resolve, reject) => {
        const options = {
            socketPath,
            path: "/v1.37/containers/create",
            method: "POST"
        };

        const clientRequest = http.request(options, (res) => {
            res.setEncoding("utf8");
            let rawData = "";
            res.on("data", (chunk) => {
                rawData += chunk;
            });
            res.on("end", () => {
                resolve();
            });
        });
        clientRequest.on("error", (e) => {
            reject(e);
        });
        clientRequest.end();
    });
}

export function PullImageByAddress(tag: string, protocol: string, host: string, port: number) {
    return new Promise<any>((resolve, reject) => {
        const options = {
            protocol: protocol + ":",
            host,
            port,
            path: "/v1.37/images/create?fromImage=" + encodeURIComponent(tag) + "&tag=latest",
            method: "POST"
        };

        const clientRequest = http.request(options, (res) => {
            res.setEncoding("utf8");
            let rawData = "";
            res.on("data", (chunk) => {
                rawData += chunk;
            });
            res.on("end", () => {
                resolve();
            });
        });
        clientRequest.on("error", (e) => {
            reject(e);
        });
        clientRequest.end();
    });
}


export function PullImageBySocket(tag: string, socketPath: string) {
    return new Promise<any>((resolve, reject) => {
        const options = {
            socketPath,
            path: "/v1.37/images/create?fromImage=" + encodeURIComponent(tag) + "&tag=latest",
            method: "POST"
        };

        const clientRequest = http.request(options, (res) => {
            res.setEncoding("utf8");
            let rawData = "";
            res.on("data", (chunk) => {
                rawData += chunk;
            });
            res.on("end", () => {
                resolve();
            });
        });
        clientRequest.on("error", (e) => {
            reject(e);
        });
        clientRequest.end();
    });
}
