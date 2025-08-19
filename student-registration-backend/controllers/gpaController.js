import {getIds} from "../utils/getId.js";
import pool from "../db/index.js";

export const getGPAByStudentIdSessionId = async (req, res) => {
    const {matric_number, session} = req.params;

    try {
        const studentId = await getIds("students", "matric_number", matric_number)

        if (!studentId) {
            return res.status(404).send(`Student not found`)
        }

        const sessionId = await getIds("academic_sessions", "name", session);
        if (!sessionId) {
            return res.status(404).send(`Session not found`)
        }

        const result = await pool.query(`
        SELECT *
        FROM student_gpa
        WHERE student_id = $1 AND session_id = $2`,
        [studentId, sessionId])

        if (result.rows.length === 0) {
            return res.status(404).json(`No GPA found`)
        }

        res.status(200).json(result.rows)
    } catch (e) {
        console.error('Error getting GPA', e)
        return res.status(404).send(`Error getting GPA: ${e}`)
    }
}