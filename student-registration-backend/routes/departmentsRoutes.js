import express from "express";
import {
    deleteDepartment,
    getDepartmentById,
    getDepartments,
    getDepartmentsByFaculty,
    registerDepartment, updateDepartmentPartially
} from "../controllers/departmentController.js";

const router = express.Router();

router.get('/', getDepartments)
router.get('/:id', getDepartmentById)
router.get('/faculty/:name', getDepartmentsByFaculty)
router.post('/register', registerDepartment)
router.patch('/:name', updateDepartmentPartially)
router.delete('/:name', deleteDepartment)

export default router;