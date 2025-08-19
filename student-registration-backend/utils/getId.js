import pool from "../db/index.js";

export async function getIds(table, column, input) {
    try {
        const query = `
        SELECT id
        FROM ${table}
        WHERE ${column} ILIKE $1`;

        const result = await pool.query(query, [input])

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0].id;
    } catch (e) {
        throw new Error(e.message)
    }

}