import express from 'express'
import {getResultByStudentId, registerNewResult, totallyAlterResult} from "../controllers/resultsController.js";

const router = express.Router()

router.get('/:matric_number', getResultByStudentId)
router.post('/register', registerNewResult)
router.put('/:id', totallyAlterResult)

export default router