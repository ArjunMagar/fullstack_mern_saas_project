import express from 'express'
import authRoute from './routes/global/authRoute'
import passport from 'passport'
import googleAuthController from "./controller/global/googleAuthController"
const app = express()
import instituteRoute from "./routes/institute/instituteRoute"
import courseRoute from "./routes/institute/course/courseRoute"
import categoryRoute from "./routes/institute/category/categoryRoute"
import teacherInstituteRoute from "./routes/institute/teacher/teacherRoute"
import teacherRoute from "./routes/teacher/teacherRoute"

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
export default app