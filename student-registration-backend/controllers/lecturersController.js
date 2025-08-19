import pool from "../db/index.js";

export const getAllLecturers = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM lecturers`)

        res.status(200).json(result.rows)
    } catch (e) {
        console.error('Error getting lecturers', e)
        return res.status(500).json('Failed to get lecturers', e)
    }
}

export const registerLecturer = async (req, res) => {
    const {name, email} = req.body;

    try {
        const result = await pool.query(`
        INSERT INTO lecturers(name, email) 
        VALUES ($1, $2)
        RETURNING *`,
        [name, email])

        res.status(201).json(result.rows)
    } catch (e) {
        console.error('Error registering lecturer', e)
        return res.status(500).json('Failed to register lecturer', e)
    }
}

export const getLecturerByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const result = await pool.query(`
        SELECT *
        FROM lecturers
        WHERE email = $1`,
        [email])

        if (result.rows.length === 0) {
            return res.status(404).send('No lecturers found.')
        }

        res.status(200).json(result.rows)
    } catch (e) {
        console.error('Error fetching lecturer', e)
        return res.status(500).json('Failed to get lecturers', e)
    }
}