import { Client, Pool } from "pg";
import { composeQuery, executeQuery } from "./builder/execute";
import { from, limit, select, where } from "./builder/query";
// just testing
const client = new Pool({
    user: "rinha",
    host: "localhost",
    database: "rinha",
    password: "rinha",
    port: 5432,
});

const main = async () => {
    const q = composeQuery(select(["saldo", "nome", "limite"]), limit(10));

    const res = await executeQuery(client, q);

    if (!res.ok) {
        console.log(res);
        return;
    }

    const { data } = res;
    console.log(data.rows);
};

main();
