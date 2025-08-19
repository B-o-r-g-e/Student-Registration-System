import express from "express";
import {
    getAllLecturers,
    getLecturerByEmail,
    registerLecturer,
    updateLecturer
} from "../controllers/lecturersController.js";

const router = express.Router();

router.get("/", getAllLecturers)
router.get("/:email", getLecturerByEmail)
router.post("/register", registerLecturer)
router.patch("/:id", updateLecturer)

export default router