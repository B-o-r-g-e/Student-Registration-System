import express from 'express'
import {getResultByStudentId, registerNewResult} from "../controllers/resultsController.js";

const router = express.Router()

router.get('/:matric_number', getResultByStudentId)
router.post('/register', registerNewResult)

export default router