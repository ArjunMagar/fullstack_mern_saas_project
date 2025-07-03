import express from 'express'
import authRoute from './routes/global/authRoute'
import passport from 'passport'
import googleAuthController from "./controller/global/googleAuthController"
const app = express()
import instituteRoute from "./routes/institute/instituteRoute"
import courseRoute from "./routes/institute/course/courseRoute"
import categoryRoute from "./routes/institute/category/categoryRoute"
import teacherRoute from "./routes/institute/teacher/teacherRoute"

app.use(express.json())

// Middleware
app.use(passport.initialize());
// Initialize Google Strategy
googleAuthController.initGoogleStrategy();

//localhost:3000/api/auth
app.use("/api/auth",authRoute)
app.use("/api/institute",instituteRoute)
app.use("/api/institute/course",courseRoute)
app.use("/api/institute/category",categoryRoute)
app.use("/api/institute/teacher",teacherRoute)
export default app