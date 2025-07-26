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