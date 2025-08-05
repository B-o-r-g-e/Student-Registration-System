import pool from "../db/index.js"

export const registerStudent = async (req, res) => {
    const {
        matric_number,
        first_name,
        middle_name,
        last_name,
        email,
        department_id,
        gender,
        date_of_birth,
        phone_number,
        level,
        semester,
        session_id,
    } = req.body;

    console.log("Request body:", req.body);

    try {
        const result = await pool.query(
            `INSERT INTO students (
                matric_number, first_name, middle_name, last_name, 
                  email, department_id, gender, date_of_birth, 
                  phone_number, level, semester, session_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
            [matric_number, first_name, middle_name, last_name, email, 
            department_id, gender, date_of_birth, phone_number, level, 
            semester, session_id,]
        );

        console.log("Insert result:", result.rows[0]); // 🔍 check what's returned

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error registering student:', error.message);
        res.status(500).json({ error: 'Failed to register student' });
    }
}

export const getStudents = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM students LIMIT 10 OFFSET 0`
        )
        res.status(200).json(result.rows);
    } catch (e) {
        console.error('Error fetching students:', e.message);
        res.status(500).json({ error: 'Failed to get students' });
    }
}

export const getStudentById = async (req, res) => {
    const { matric_number } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM students WHERE matric_number = $1`,
            [matric_number]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (e) {
        console.error('Error fetching student by ID:', e.message);
        res.status(500).json({ error: 'Failed to get student' });
    }
};


export const updateStudent = async (req, res) => {
    const { matric_number } = req.params
    const {
        first_name,
        middle_name,
        last_name,
        email,
        phone_number,
        gender,
        date_of_birth,
        department_id,
        level,
        semester,
        session_id
    } = req.body;
    try {
        const result = await pool.query(
            `UPDATE students
            SET first_name = $1, middle_name = $2, last_name = $3, 
                email = $4, phone_number = $5, gender = $6, 
                date_of_birth = $7, department_id = $8, level = $9,
                semester = $10, session_id = $11
                WHERE matric_number = $12
                RETURNING *`,
            [first_name, middle_name, last_name, email, phone_number,
                gender, date_of_birth, department_id, level, semester,
                session_id, matric_number]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (e) {
        console.error(error.message);
        res.status(500).json({ message: "Server error"})
    }
}

export const updateStudentPartially = async (req, res) => {
    const { matric_number} = req.params;
    const fields = req.body

    if (Object.keys(fields).length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }

    const setClauses = [];
    const values = [];

    let index = 1
    for (let key in fields) {
        setClauses.push(`${key} = $${index}`)
        values.push(fields[key])
        index++
    }

    values.push(matric_number);

    const query = `
        UPDATE students 
        SET ${setClauses.join(', ')}
        WHERE matric_number = $${index}
        RETURNING *
    `;

    try {
        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json({message: 'Student updated', student: result.rows[0]});
    } catch (error) {
        console.error('Error updating student:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteStudent = async (req, res) => {
    const { matric_number } = req.params;

    try {
        const result = await pool.query(`
            DELETE FROM students 
            WHERE matric_number = $1
            RETURNING *`,
            [matric_number]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted' });
    } catch (e) {
        console.error('Error deleting student:', e.message);
        res.status(500).json({ error: 'Failed to delete student' });
    }
}