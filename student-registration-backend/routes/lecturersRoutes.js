import express from "express";
import {getAllLecturers, getLecturerByEmail, registerLecturer} from "../controllers/lecturersController.js";

const router = express.Router();

router.get("/", getAllLecturers)
router.get("/:email", getLecturerByEmail)
router.post("/register", registerLecturer)

export default router