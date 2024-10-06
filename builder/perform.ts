import { Client, Pool, type QueryResult } from "pg";
import type { Query } from "./query";
import { err, ok, type Result } from "../utils/result";

export const composeQuery = (...fns: Array<(val: Query) => Query>): Query => {
    const initialQuery: Query = { params: [] };

    return fns.reduce((val, fn) => fn(val), initialQuery);
};
export const buildQuery = (query: Query): Result<{ text: string; values: unknown[] }> => {
    if (query.select) {
        let sql = `SELECT ${query.select.join(", ")} FROM ${query.from}`;
        if (query.where) sql += ` WHERE ${query.where}`;
        if (query.limit) sql += ` LIMIT ${query.limit}`;

        return ok({ text: sql, values: query.params });
    }

    if (query.insertInto) {
        const columns = Object.keys(query.values!);
        const placeHolders = columns.map((_, i) => `$${i + 1}`);

        return ok({
            text: `INSERT INTO ${query.insertInto} (${columns.join(", ")}) VALUES (${placeHolders.join(", ")})`,
            values: query.params,
        });
    }

    if (query.update) {
        const set = Object.keys(query.set!)
            .map((key, i) => `${key} = $${i + 1}`)
            .join(", ");

        return ok({
            text: `UPDATE ${query.update} SET ${set}`,
            values: query.params,
        });
    }

    if (query.deleteFrom) {
        let sql = `DELETE FROM ${query.deleteFrom}`;

        if (query.where) sql += ` WHERE ${query.where}`;

        return ok({ text: sql, values: query.params });
    }

    return err("invalid query");
};

export const executeQuery = async (
    client: Client | Pool,
    query: Query,
): Promise<Result<QueryResult>> => {
    const result = buildQuery(query);
    if (!result.ok) {
        return err(result.error.message);
    }
    const { text, values } = result.data;

    try {
        const res = await client.query(text, values);
        return ok(res);
    } catch (error: any) {
        return err(error.message);
    }
};
