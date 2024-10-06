import type { Record } from "@prisma/client/runtime/library";

export type Query = {
    select?: string[];
    from?: string;
    where?: string;
    insertInto?: string;
    values?: Record<string, unknown>;
    update?: string;
    set?: Record<string, unknown>;
    deleteFrom?: string;
    limit?: number;
    params: unknown[];
};

export const select =
    (columns: string[]) =>
    (query: Query = { params: [] }): Query => ({
        ...query,
        select: columns,
    });

export const from =
    (table: string) =>
    (query: Query): Query => ({
        ...query,
        from: table,
    });

export const where =
    (condition: string, ...params: unknown[]) =>
    (query: Query): Query => ({
        ...query,
        where: condition.replace(/\?/g, () => `$${query.params.length + 1}`),
        params: [...query.params, ...params],
    });

export const insertInto =
    (table: string, values: Record<string, unknown>) =>
    (query: Query = { params: [] }): Query => ({
        ...query,
        insertInto: table,
        values: values,
        params: [...query.params, ...Object.values(values)],
    });

export const update =
    (table: string, values: Record<string, unknown>) =>
    (query: Query = { params: [] }): Query => ({
        ...query,
        update: table,
        set: values,
        params: [...query.params, ...Object.values(values)],
    });

export const deleteFrom =
    (table: string) =>
    (query: Query = { params: [] }): Query => ({
        ...query,
        deleteFrom: table,
    });

export const limit =
    (n: number) =>
    (query: Query): Query => ({
        ...query,
        limit: n,
    });
