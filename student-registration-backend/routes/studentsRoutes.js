import express from "express";
import {
    deleteStudent,
    getStudentById,
    getStudents,
    registerStudent,
    updateStudent,
    updateStudentPartially
} from "../controllers/studentController.js";

const router = express.Router();

router.post('/register', registerStudent);
router.get('/', getStudents);
router.get('/:matric_number', getStudentById)
router.put('/:matric_number', updateStudent);
router.patch('/:matric_number', updateStudentPartially)
router.delete('/:matric_number', deleteStudent);

export default router;