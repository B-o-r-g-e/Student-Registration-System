import express from "express";
import {getStudentById, getStudents, registerStudent, updateStudent} from "../controllers/studentController.js";

const router = express.Router();

router.post('/register', registerStudent);
router.get('/', getStudents);
router.get('/:matric_number', getStudentById)
router.put('/:matric_number', updateStudent);

export default router;