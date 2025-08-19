import pool from "../db/index.js";
import {getIds} from "../utils/getId.js";

export const registerNewResult = async(req, res) => {
    const {matric_number, course_code, score,
        semester, level, session, } = req.body;

    try {
        //Get student id from the provided matric number
        const getStudentId = await pool.query(`
        SELECT id 
        FROM students
        WHERE matric_number ILIKE $1`,
        [matric_number])

        if (getStudentId.rows.length === 0) {
            return res.status(404).send(`Student with the matric number ${matric_number} not found`)
        }

        const student_id = getStudentId.rows[0].id;

        //Get course code
        const getCourseId = await pool.query(`
        SELECT id 
        FROM courses
        WHERE course_code ILIKE $1`,
        [course_code])

        if (getCourseId.rows.length === 0) {
            return res.status(404).send(`Course with the course code ${course_code} not found`)
        }

        const course_id = getCourseId.rows[0].id;

        const getSession = await pool.query(`
        SELECT id 
        FROM academic_sessions
        WHERE name ILIKE $1`,
        [session])

        if (getSession.rows.length === 0) {
            return res.status(404).send(`Session with the session ${session} not found`)
        }

        const session_id = getSession.rows[0].id;

        //Post request
        const result = await pool.query(`
        INSERT INTO results (student_id, course_id, score, semester, level, session_id) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [student_id, course_id, score, semester, level, session_id])

        res.status(201).send(result.rows[0])
    } catch (error) {
        console.error('Error registering result ', error)
        res.status(400).json({error: "Failed to register result"})
    }
}

export const getResultByStudentId = async(req, res) => {
    const {matric_number} = req.params;

    try {
        const getStudent = await pool.query(`
        SELECT id 
        FROM students
        WHERE matric_number ILIKE $1`,
        [matric_number]);

        if (getStudent.rows.length === 0) {
            return res.status(404).json(`student with the matric number ${matric_number} not found`)
        }

        const studentId = getStudent.rows[0].id;

        const result = await pool.query(`
        SELECT r.id, s.matric_number, c.course_code, r.score, r.grade, r.semester, r.level, a.name AS academic_session, r.grade_point, r.quality_point
        FROM results r
        JOIN students s ON s.id = r.student_id
        JOIN courses c ON c.id = r.course_id
        JOIN academic_sessions a ON a.id = r.session_id
        WHERE student_id = $1`,
        [studentId])

        if (getStudent.rows.length === 0) {
            return res.status(404).json(`Student ${matric_number} does not have a saved result`)
        }

        res.status(200).json(result.rows)
    } catch (e) {
        console.error('Error getting result', e)
        res.status(500).json({error: "Failed to get result"})
    }
}

export const totallyAlterResult = async(req, res) => {
    const {id} = req.params;
    const {matric_number, course_code, score, semester, level, session} = req.body

    try{
        const studentId = await getIds("students", "matric_number", matric_number)

        if (!studentId) {
            return res.status(404).json(`Student with the matric number ${matric_number} not found`)
        }

        const courseId = await getIds("courses", "course_code", course_code)

        if (!courseId) {
            return res.status(404).json(`Course with the course code ${course_code} not found`)
        }

        const sessionId = await getIds("academic_sessions", "name", session)
        if (!sessionId) {
            return res.status(404).json(`Session with the course code ${course_code} not found`)
        }

        const result = await pool.query(`
        UPDATE results
        SET student_id = $1, course_id = $2, score = $3, semester = $4, 
            level = $5, session_id = $6
            WHERE id = $7
            RETURNING *`,
            [studentId, courseId, score, semester, level, sessionId, id])

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Result not found'})
        }
        res.status(200).json(result.rows[0])
    } catch (e) {
        console.error(e.message)
        res.status(500).json({error: "Failed to get result"})
    }
}

export const partiallyUpdateResult = async (req, res) => {
    const {id} = req.params;
    const fields = req.body;

    if (fields.matric_number){
        const studentResult = await getIds("students", "matric_number", fields.matric_number)

        if (!studentResult) {
            return res.status(404).json({error: 'Student not found'})
        }

        fields.student_id = studentResult
        delete fields.matric_number
    }

    if (fields.course_code) {
        const courseResult = await getIds("courses", "course_code", fields.course_code)

        if (!courseResult) {
            return res.status(404).json({error: 'Course not found'})
        }

        fields.course_id = courseResult
        delete fields.course_code
    }

    if (fields.session_name) {
        const sessionResult = await getIds("academic_sessions", "name", fields.session_name)

        if (!sessionResult) {
            return res.status(404).json({error: 'Session not found'})
        }

        fields.session_id = sessionResult
        delete fields.session_name
    }

    const setClauses = []
    const values = []

    let index = 1
    for (let key in fields) {
        setClauses.push(`${key} = $${index}`)
        values.push(fields[key])
        index++
    }

    console.log(setClauses)

    values.push(id)
    console.log(values)

    const whereIndex = index

    const query = `UPDATE results
    SET ${setClauses.join(', ')}
    WHERE id = $${whereIndex}
    RETURNING *`

    try {
        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Result not found'})
        }

        res.status(200).json(result.rows)
    } catch (e) {
        console.error("Error fetching result", e)
        res.status(500).json({error: "Failed to get result"})
    }
}