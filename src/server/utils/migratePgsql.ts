import { exec } from "child_process";

export interface IPgsqlDb {
    db: string;
    address: string;
    port: number;
    user: string;
}

const Migrate = async (source: IPgsqlDb, target: IPgsqlDb): Promise<any> => {
    const migrateCommand = `pg_dump -C -h ${source.address} -p ${source.port} -U ${source.user} ${source.db}`
        + ` | psql -h ${target.address} -p ${target.port} -U ${target.user} ${target.db}`;
    const { stdout, stderr } = await exec(migrateCommand);
    console.log(stdout);
};

export default Migrate;
