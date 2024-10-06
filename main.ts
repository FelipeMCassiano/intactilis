import { Client, Pool } from "pg";
import { composeQuery, executeQuery } from "./builder/perform";
import { from, limit, select, where } from "./builder/query";
import { connect } from "bun";

const client = new Pool({
    user: "rinha",
    host: "localhost",
    database: "rinha",
    password: "rinha",
    port: 5432,
});

const main = async () => {
    const q = composeQuery(select(["saldo", "nome", "limite"]), from("clientes"), limit(10));

    const res = await executeQuery(client, q);

    if (!res.ok) {
        console.log(res);
        return;
    }

    const { data } = res;
    console.log(data.rows);
};

main();
