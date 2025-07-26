import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import studentsRoutes from "./routes/studentsRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send('Student Registration Backend is running with import');
})

app.use('/api/students', studentsRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log( `server is running on port ${PORT}` );
})