import express from "express";
import {
    getAllCourses, getAllRegisteredCoursesByStudent,
    getCoursesByDepartment, getCoursesByLevelSemesterAndDepartment,
    getCoursesByName, getRegisteredCoursesByStudentPerSession,
    registerCourse, registerMultipleCourses, unregisterCourse, updateCourse
} from "../controllers/coursesController.js";

const router = express.Router();

router.get('/', getAllCourses)
router.get('/department/:name', getCoursesByDepartment)
router.get('/registration/registeredCourses', getRegisteredCoursesByStudentPerSession)
router.get('/registration/allRegisteredCourses/:student_id', getAllRegisteredCoursesByStudent)
router.get('/:level/:semester/:department', getCoursesByLevelSemesterAndDepartment)
router.get('/:name', getCoursesByName)
router.post('/register', registerCourse)
router.post('/registerCourses', registerMultipleCourses)
router.patch('/:course_code', updateCourse)
router.delete('/registration/unregisterCourse/:student_id', unregisterCourse)

export default router