import pool from "../db/index.js"

export const getFaculties = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM faculties`
        )

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching faculties:', error.message);
        res.status(500).json({ error: 'Failed to fetch faculties' });
    }
}

export const getFacultyById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM faculties WHERE id = $1`,
            [id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        res.status(200).json({ faculties: result.rows });
    } catch (e) {
        console.error('Error fetching faculty by ID:', e.message);
        res.status(500).json({ error: 'Failed to get faculty' });
    }
}

export const registerFaculty = async (req, res) => {
    const { name } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO faculties(name) 
            VALUES ($1)
            RETURNING *`,
            [name]
        )
        res.status(200).json(result.rows[0])
    } catch (error) {
        console.error('Error registering faculty:', e.message);
        res.status(400).json({error: 'Failed to register faculty'});
    }
}

export const updateFacultyPartially = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const result = await pool.query(
            `UPDATE faculties
            SET name = $1
            WHERE id = $2
            RETURNING *`,
            [name, id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        res.status(200).json("Faculty Updated",result.rows[0]);
    } catch (e) {
        console.error("Error updating faculty:", e.message);
        res.status(500).json({ error: 'Failed to update faculty' });
    }
}

export const deleteFaculty = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM faculties
            WHERE id = $1
            RETURNING *`,
            [id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        res.status(202).json('Faculty Deleted')
    } catch (e) {
        console.error('Error deleting faculty:', e.message );
        res.status(500).json({ error: 'Failed to delete faculty' });
    }
}