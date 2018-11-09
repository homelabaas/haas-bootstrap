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
    const cmd1 = `/usr/bin/pg_dump -C -h ${source.address} -p ${source.port} -U ${source.user} ${source.db} > /tmp/out.sql`;
    const cmd2 =  `cat /tmp/out.sql | /usr/bin/psql -h ${target.address} -p ${target.port} -U ${target.user}`;
    console.log(cmd1);
    const { stdout, stderr } = await execAsync(cmd1, { env: { PGPASSWORD: source.password } });
    console.log(stdout);
    console.log(cmd2);
    const { stdout: stdout2, stderr: stderr2 } = await execAsync(cmd2, { env: { PGPASSWORD: target.password } });
    console.log(stdout2);
};
