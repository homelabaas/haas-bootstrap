import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);

export interface IPgsqlDb {
    db: string;
    address: string;
    port: number;
    user: string;
    password: string;
}

export const Migrate = async (source: IPgsqlDb, target: IPgsqlDb): Promise<void> => {
    const migrateCommand = `pg_dump -C -h ${source.address} -p ${source.port} -U ${source.user} ${source.db}`
        + ` | psql -h ${target.address} -p ${target.port} -U ${target.user} ${target.db}`;
    console.log(migrateCommand);
    const { stdout, stderr } = await execAsync(migrateCommand, { env: { PGPASSWORD: source.password } });
    console.log("stdout");
    console.log(stdout);
    console.log("stderr");
    console.log(stderr);
};
