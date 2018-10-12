import * as http from "http";
export function PullImage(tag: string, socketPath: string) {
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
