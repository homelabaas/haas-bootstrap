import { IDockerContainer } from "./IDockerContainer";

export const getContainerDefinitions = (postgresAddress: string,
                                        minioAccessKey: string,
                                        minioSecretKey: string): IDockerContainer[] => {
    return [
            {
                Name: "haas_postgres",
                Container: "postgres",
                EnvironmentVars: [
                    {
                        key: "POSTGRES_PASSWORD",
                        value: "devpostgrespwd"
                    }
                ],
                PortMapping: [
                    {
                        container: 5432,
                        host: 5432
                    }
                ]
            },
            {
                Name: "haas_seq",
                Container: "datalust/seq",
                EnvironmentVars: [
                    {
                        key: "ACCEPT_EULA",
                        value: "Y"
                    }
                ],
                PortMapping: [
                    {
                        container: 5341,
                        host: 5341
                    },
                    {
                        container: 80,
                        host: 8085
                    }
                ]
            },
            {
                Name: "haas_minio",
                Container: "minio/minio",
                EnvironmentVars: [
                    {
                        key: "MINIO_ACCESS_KEY",
                        value: minioAccessKey
                    },
                    {
                        key: "MINIO_SECRET_KEY",
                        value: minioSecretKey
                    }
                ],
                PortMapping: [
                    {
                        container: 9000,
                        host: 9000
                    }
                ],
                Command: ["server", "/data"]
            },
            {
                Name: "haas_haas-application",
                Container: "homelabaas/haas-application",
                EnvironmentVars: [
                    {
                        key: "NODE_CONFIG",
                        value : "{\"Database\":{ \"ConnectionString\":\"postgres://postgres:devpostgrespwd@"
                            + postgresAddress + ":5432/\"},"
                            + "\"Logfiles\": {"
                            + "\"AccessFilename\": \"access.log\","
                            + "\"AccessLogFormat\": \"[:date[clf]] :id :status :method :url :response-time\","
                            + "\"SeqUrl\":\"http://" + postgresAddress + ":5341\""
                            + "}}"
                    }
                ],
                PortMapping: [
                    {
                        container: 3000,
                        host: 3000
                    }
                ],
                VolumeMapping: [
                    {
                        hostVolume: "/var/run/docker.sock",
                        containerVolume: "/var/run/docker.sock"
                    }
                ]
            }
        ];
};
