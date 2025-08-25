import express from 'express'
import authRoute from './routes/global/authRoute'
import passport from 'passport'
import googleAuthController from "./controller/global/googleAuthController"

import instituteRoute from "./routes/institute/instituteRoute"
import courseRoute from "./routes/institute/course/courseRoute"
import categoryRoute from "./routes/institute/category/categoryRoute"
import teacherInstituteRoute from "./routes/institute/teacher/teacherRoute"
import teacherRoute from "./routes/teacher/teacherRoute"
import chapterRoute from "./routes/teacher/course/chapters/course-chapter-route"
import lessonRoute from "./routes/teacher/course/lessons/chapter-lesson-route"
import studentInstituteRoute from "./routes/student/institute/student-institute.route"
import cors from 'cors'
const app = express()
app.use(cors({
    origin: "*"
}))
app.use(express.json())

// Middleware
app.use(passport.initialize());
// Initialize Google Strategy
googleAuthController.initGoogleStrategy();

// GLOBAL ROUTE
app.use("/api/auth",authRoute)

//INSTITUTE ROUTE
app.use("/api/institute",instituteRoute)
app.use("/api/institute/course",courseRoute)
app.use("/api/institute/category",categoryRoute)
app.use("/api/institute/teacher",teacherInstituteRoute)

//TEACHER ROUTE
app.use("/api/teacher",teacherRoute)
app.use("/api/teacher/course",chapterRoute)
app.use("/api/teacher/course",lessonRoute)

//STUDENT ROUTE
app.use("/api/student",studentInstituteRoute)


export default app