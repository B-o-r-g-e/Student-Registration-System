import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studentsRoutes from "./routes/studentsRoutes.js";
import facultyRoutes from "./routes/facultiesRoutes.js";
import departmentRoutes from "./routes/departmentsRoutes.js";
import coursesRoutes from "./routes/coursesRoutes.js";
import resultsRoutes from "./routes/resultsRoutes.js";
import gpaRoutes from "./routes/gpaRoutes.js";
import lecturersRoutes from "./routes/lecturersRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send('Student Registration Backend is running with import');
})

app.use('/api/students', studentsRoutes)
app.use('/api/faculties', facultyRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/courses', coursesRoutes)
app.use('/api/results', resultsRoutes)
app.use('/api/gpa', gpaRoutes)
app.use('/api/lecturers', lecturersRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log( `server is running on port ${PORT}` );
})