import pool from '../db/index.js'

export const getDepartments = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT d.id, d.name, f.name AS faculty_name, d.duration
            FROM departments d
            JOIN faculties f ON d.faculty_id = f.id
        `)

        res.status(200).json(result.rows);
    } catch (e) {
        console.error('Error fetching departments:', e.message);
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
}

export const getDepartmentById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT d.name, f.name AS faculty_name, d.duration
            FROM departments d
            JOIN faculties f ON d.faculty_id = f.id
            WHERE d.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({message: 'No department found with this id'})
        }

        res.status(200).json(result.rows[0]);
    } catch (e) {
        console.error('Error fetching department by ID:', e.message);
        res.status(500).json({ error: 'Failed to get department' });
    }

}

export const getDepartmentsByFaculty = async (req, res) => {
    const { name } = req.params;

    try {
        const facultyResult = await pool.query(`
        SELECT id FROM faculties
        WHERE name ILIKE $1`,
        [name])

        if (facultyResult.rows.length === 0) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        const faculty_id = facultyResult.rows[0].id;

        const result = await pool.query(`
        SELECT d.id, d.name, f.name AS faculty_name, d.duration
        FROM departments d
        JOIN faculties f ON d.faculty_id = f.id
        WHERE d.faculty_id = $1`,
        [faculty_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No departments found for this faculty' });
        }

        res.status(200).json(result.rows);
    } catch (e) {
        console.error('Error fetching departments by faculty:', e.message);
        res.status(500).json({ error: 'Failed to fetch departments by faculty' });
    }
}

export const registerDepartment = async (req, res) => {
    const { name, faculty, duration } = req.body;

    try {
        const facultyResult = await pool.query(`
         SELECT id FROM faculties
         WHERE name ILIKE $1`,
        [faculty]
        )

        if (facultyResult.rows.length === 0) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        const faculty_id = facultyResult.rows[0].id;

        const result = await pool.query(`
            INSERT INTO departments (name, faculty_id, duration)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [name, faculty_id, duration]
        )

        res.status(200).json(result.rows[0])
    } catch (e) {
        console.error('Error registering department:', e.message);
        res.status(500).json({ error: 'Failed to register department' });
    }
}

export const updateDepartmentPartially = async (req, res) => {
    const { name } = req.params;
    const fields = req.body;

    console.log("name ", name)

    if (Object.keys(fields).length === 0) {
        return res.status(400).json({ message: 'No fields provided for update' });
    }

    if (fields.faculty) {
        const facultyResult = await pool.query(`
        SELECT id FROM faculties
        WHERE name ILIKE $1`,
        [fields.faculty]
        );

        if (facultyResult.rows.length === 0) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        fields.faculty_id =  facultyResult.rows[0].id
        delete fields.faculty

        console.log('fields after faculty check', fields)
    }

    const setClauses = [];
    const values = [];

    let index = 1;
    for (let key in fields) {
        setClauses.push(`${key} = $${index}`);
        values.push(fields[key]);
        index++;
    }

    console.log('setClauses', setClauses)
    values.push(name); // for WHERE clause (last placeholder)

    console.log('values', values)

    const whereIndex = index
    const query = `
        UPDATE departments
        SET ${setClauses.join(', ')}
        WHERE name ILIKE $${whereIndex}
        RETURNING *;
    `;

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No departments found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (e) {
        console.error('Error updating department:', e.message);
        res.status(500).json({ error: 'Failed to update department' });
    }
}

export const deleteDepartment = async (req, res) => {
    const { name } = req.params;

    try {
        const result = await pool.query(`
            DELETE FROM departments
            WHERE name ILIKE $1
            RETURNING *;`,
            [name]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }

        res.status(202).json({ message: 'Department deleted successfully' });
    } catch (e) {
        console.error('Error deleting department:', e.message);
        res.status(500).json({ error: 'Failed to delete department' });
    }
}