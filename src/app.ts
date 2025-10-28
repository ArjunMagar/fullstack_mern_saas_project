import express from 'express'
import authRoute from './routes/global/authRoute'
import passport from 'passport'
import googleAuthController from "./controller/global/googleAuthController"

import instituteRoute from "./routes/institute/instituteRoute"
import courseRoute from "./routes/institute/course/courseRoute"
import categoryRoute from "./routes/institute/category/categoryRoute"
import teacherInstituteRoute from "./routes/institute/teacher/teacherRoute"
import teacherRoute from "./routes/teacher/teacherRoute"
import teacherCourseRoute from "./routes/teacher/course/teacher-course-route"
import chapterRoute from "./routes/teacher/course/chapters/course-chapter-route"
import lessonRoute from "./routes/teacher/course/lessons/chapter-lesson-route"
import studentInstituteRoute from "./routes/student/institute/student-institute.route"
import studentCartRoute from "./routes/student/cart/student-cart.route"
import studentCourseOrderRoute from "./routes/student/order/student-order.route"
import studentCourseRoute from "./routes/student/course/student-course.route"
import studentChapterRoute from "./routes/student/course/chapters/student-course-chapter.route"
import studentLessonRoute from "./routes/student/course/lessons/student-chapter-lesson.route"
import cors from 'cors'
const app = express()
app.use(cors({
    origin: "*"
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
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
app.use("/api/teacher/course",teacherCourseRoute)
app.use("/api/teacher/course",chapterRoute)
app.use("/api/teacher/course",lessonRoute)

//STUDENT ROUTE
app.use("/api/student",studentInstituteRoute)
app.use("/api/student",studentCartRoute)
app.use("/api/student",studentCourseOrderRoute)
app.use("/api/student/course",studentCourseRoute)
app.use("/api/student/course",studentChapterRoute)
app.use("/api/student/course",studentLessonRoute)

export default app