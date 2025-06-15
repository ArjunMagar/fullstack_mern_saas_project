import express from 'express'
import authRoute from './routes/global/authRoute'
import passport from 'passport'
import googleAuthController from "./controller/global/googleAuthController"
import cors from 'cors'
const app = express()
import instituteRoute from "./routes/institute/instituteRoute"

app.use(express.json())

// Middleware
app.use(passport.initialize());
// Initialize Google Strategy
googleAuthController.initGoogleStrategy();

//localhost:3000/api/auth
app.use("/api/auth",authRoute)
app.use("/api/institute",instituteRoute)
export default app