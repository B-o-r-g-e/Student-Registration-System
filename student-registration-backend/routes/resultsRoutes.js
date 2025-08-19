import express from 'express'
import {
    getResultByStudentId,
    partiallyUpdateResult,
    registerNewResult,
    totallyAlterResult
} from "../controllers/resultsController.js";

const router = express.Router()

router.get('/:matric_number', getResultByStudentId)
router.post('/register', registerNewResult)
router.put('/:id', totallyAlterResult)
router.patch('/:id', partiallyUpdateResult)

export default router