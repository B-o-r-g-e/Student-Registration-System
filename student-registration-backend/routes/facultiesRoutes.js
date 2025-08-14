import express from "express";
import {
    deleteFaculty,
    getFaculties,
    getFacultyById,
    registerFaculty,
    updateFacultyPartially
} from "../controllers/facultyController.js";

const router = express.Router();

router.get("/", getFaculties);
router.get("/:id", getFacultyById);
router.post("/register", registerFaculty)
router.patch("/:id", updateFacultyPartially)
router.delete("/:id", deleteFaculty);

export default router;