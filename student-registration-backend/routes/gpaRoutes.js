import express from "express";
import {getGPAByStudentIdSessionId} from "../controllers/gpaController.js";

const router = express.Router();

router.get("/:matric_number/:session", getGPAByStudentIdSessionId)

export default router