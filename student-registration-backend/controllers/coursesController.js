import pool from "../db/index.js";

export const getAllCourses = async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT c.id, c.course_code, c.course_name, d.name AS department_name, c.level, c.semester, c.units
        FROM courses c
        JOIN departments d On c.department_id = d.id`)

        res.status(200).json(result.rows)
    } catch (e) {
        console.error('Error fetching courses:', e.message);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
}

export const getCoursesByName = async (req, res) => {
    const { name } = req.params;

    try {
        const result = await pool.query(`
            SELECT c.id, c.course_code, c.course_name, d.name AS department_name, c.level, c.semester, c.units
            FROM courses c
            JOIN departments d ON c.department_id = d.id
            WHERE c.course_name ILIKE $1`,
            [name]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No courses found for the specified name' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching courses:', error.message);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
}

export const getCoursesByDepartment = async (req, res) => {
    const { name } = req.params

    try {
        const departmentResult = await pool.query(`
            SELECT id FROM departments
            WHERE name ILIKE $1`,
            [name]);

        if (departmentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }

        const department_id = departmentResult.rows[0].id;
        console.log('Department ID:', department_id);

        const result = await pool.query(`
            SELECT c.id, c.course_code, c.course_name, d.name AS department_name, c.level, c.semester, c.units
            FROM courses c
            JOIN departments d ON c.department_id = d.id
            WHERE c.department_id = $1`,
            [department_id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No courses found for the specified department' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching courses by department:', error.message);
        res.status(500).json({ error: 'Failed to fetch courses by department' });
    }
}

export const getCoursesByLevelSemesterAndDepartment = async (req, res) => {
    const { department, level, semester } = req.params;

    try {
        //Get department id
        const departmentResult = await pool.query(`
        SELECT id FROM departments
        WHERE name ILIKE $1`,
            [department])

        if (departmentResult.rows.length === 0) {
            return res.status(404).json({error: 'Department not found'});
        }

        const department_id = departmentResult.rows[0].id;

        //Get courses for a semester and level
        const result = await pool.query(`
        SELECT c.id, c.course_code, c.course_name, d.name AS department_name, c.level, c.semester, c.units
        FROM courses c
        JOIN departments d ON c.department_id = d.id
        WHERE c.department_id = $1 AND c.level = $2 AND c.semester = $3`,
            [department_id, level, semester])

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'No courses found for the specified department, level and semester' });
        }

        res.status(200).json(result.rows);
    } catch (e) {
        console.error('Error fetching courses by department:', error.message);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
}

export const getRegisteredCoursesByStudentPerSession = async (req, res) => {
    const { student_id, session_id } = req.body;

    if (!student_id || !session_id) {
        return res.status(400).json({ error: 'Missing or invalid parameters' });
    }

    try {
        const result = await pool.query(`
        SELECT * 
        FROM registrations
        WHERE student_id = $1 AND session_id = $2`,
            [student_id, session_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No registered courses found for this student in the specified session' });
        }

        res.status(200).json(result.rows);
    } catch (e) {
        console.error('Error fetching registered courses for student:', e.message);
        res.status(500).json({ error: 'Failed to fetch registered courses for student'})
    }
}

export const registerCourse = async (req, res) => {
    const { course_code, course_name, department, level, semester, units } = req.body;

    try {
        //Get department ID
        const departmentResult = await pool.query(`
            SELECT id FROM departments
            WHERE name ILIKE $1`,
            [department]
        );
        if (departmentResult.rows.length === 0) {
            return res.status(404).json({error: 'Department not found'});
        }

        const department_id = departmentResult.rows[0].id;

        //Insert course
        const result = await pool.query(`
            INSERT INTO courses (course_code, course_name, department_id, level, semester, units) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;`,
            [course_code, course_name, department_id, level, semester, units]
        )

        res.status(201).json(result.rows[0]);
        
    } catch (error) {
        console.error('Error registering course:', error.message);
        res.status(500).json({ error: 'Failed to register course' });
    }
}

export const updateCourse = async (req, res) => {
    const { course_code } = req.params;
    const fields = req.body;

    console.log('fields', fields);
    console.log('course_code', course_code);

    if (Object.keys(fields).length === 0) {
        return res.status(400).json({message: "No fields provided for update"})
    }

    if (fields.department) {
        const departmentResult = await pool.query(`
        SELECT id
        FROM departments
        WHERE name ILIKE $1`,
        [fields.department])

        if (departmentResult.rows.length === 0) {
            return res.status(404).json({error: 'Department not found'});
        }

        fields.department_id = departmentResult.rows[0].id;
        delete fields.department

        console.log('fields after faculty check', fields)
    }

    const setClauses = []
    const values = []


    let index = 1

    for (let key in fields) {
        setClauses.push(`${key} = $${index}`);
        values.push(fields[key]);
        index++
    }

    values.push(course_code);

    console.log('setClause', setClauses);
    console.log('values', values);

    const whereIndex = index
    const query = `UPDATE courses
    SET ${setClauses.join(', ')}
    WHERE course_code ILIKE $${whereIndex}
    RETURNING *;
    `;

    try{
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'No courses found for update'})
        }

        res.status(200).json(result.rows);
    } catch (e) {
        console.error('Error fetching courses by department:', error.message);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
}

export const registerMultipleCourses = async (req, res) => {
    const { student_id, session_id, course_ids } = req.body;

    if (!student_id || !session_id || !Array.isArray(course_ids) || course_ids.length === 0) {
        return res.status(400).json({ error: 'Missing or invalid parameters' });
    }

    try {
        await pool.query(
            'CALL register_multiple_courses($1, $2, $3)',
            [student_id, session_id, course_ids]
        );

        const logMessage = await pool.query(`
        SELECT * 
        FROM registration_logs
        WHERE student_id = $1 AND session_id = $2
        ORDER BY log_time`,
        [student_id, session_id])

        res.status(200).json({
            message: 'Registration process completed',
            logs: logMessage.rows
        });
    } catch (e) {
        console.error('Error registering multiple courses:', e.message);
        res.status(500).json({ error: 'Failed to register multiple courses' });
    }
}

export const getAllRegisteredCoursesByStudent = async (req, res) => {
    const { student_id } = req.params;

    if (!student_id) {
        return res.status(400).json({ error: 'Missing student ID' });
    }

    try {
        const result = await pool.query(`
        SELECT *
        FROM registrations
        WHERE student_id = $1`,
        [student_id])

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'No courses registered by student'})
        }

        res.status(200).json(result.rows);
    } catch (e) {
        console.error('Error fetching registered courses by student:', e.message);
        res.status(500).json({ error: 'Failed to fetch registered courses by student'  });
    }
}

export const unregisterCourse = async (req, res) => {
    const { student_id } = req.params;
    const { course_ids } = req.body;

    try {
        const result = await pool.query(`
        DELETE FROM registrations
        WHERE student_id = $1 AND course_id = $2
        RETURNING *`,
        [student_id, course_ids])

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Course not registered by student'})
        }

        res.status(200).json(result.rows);
    } catch (e) {
        console.error('Error deleting courses by student:', e.message);
        res.status(500).json({ error: 'Failed to delete courses by student'  });
    }
}