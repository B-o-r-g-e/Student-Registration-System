import express from 'express'
import {getResultByStudentId, registerNewResult} from "../controllers/resultsController.js";

const router = express.Router()

router.post('/register', registerNewResult)
router.get('/:matric_number', getResultByStudentId)

export default router