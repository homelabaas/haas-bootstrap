import * as fs from "fs";
import { Client } from "minio";
import * as path from "path";
import * as tmp from "tmp";

const excludeFiles = [ "/.git", "/LICENSE", "/readme.md" ];

export class GitMinioSync {
    public MinioClient: Client;
    public BucketName: string;
    public RepositoryUrl: string;

    constructor(endPoint: string, port: number, accessKey: string, secretKey: string, bucketName: string,
                repositoryUrl: string) {
        this.MinioClient = new Client({
            endPoint,
            port,
            accessKey,
            secretKey,
            useSSL: false
        });
        this.BucketName = bucketName;
        this.RepositoryUrl = repositoryUrl;
    }

    public SyncRepository = async (): Promise<void> => {
        // Create bucket if it doesn't exist
        if (!(await this.MinioClient.bucketExists(this.BucketName))) {
            await this.MinioClient.makeBucket(this.BucketName, "us-east-1");
        }
        const tempDirectory = tmp.dirSync();
        const git = require("simple-git/promise");
        await git().clone(this.RepositoryUrl, tempDirectory.name);
        await this.CopyRecursiveSync(tempDirectory.name, "");
    }

    private CopyRecursiveSync = async (src: string, dest: string) => {
        if (excludeFiles.indexOf(dest) !== -1) {
            return;
        }
        const exists = fs.existsSync(src);
        const stats = exists && fs.statSync(src);
        const isDirectory = exists && stats.isDirectory();
        if (exists && isDirectory) {
            fs.readdirSync(src).forEach(async (childItemName) => {
                await this.CopyRecursiveSync(path.join(src, childItemName), dest + "/" + childItemName);
          });
        } else {
            this.MinioClient.fPutObject(this.BucketName, dest.substr(1), src, {}, (err, etag) => {
                if (err) {
                    throw err;
                }
                return console.log(etag);
            });
        }
    }
}
