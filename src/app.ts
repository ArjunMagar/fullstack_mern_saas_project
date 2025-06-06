import express from 'express'
import authRoute from './routes/global/authRoute'
import passport from 'passport'
import googleAuthController from "./controller/global/googleAuthController"
const app = express()

app.use(express.json())
// Initialize Google Strategy
googleAuthController.initGoogleStrategy();
// Middleware
app.use(passport.initialize());

//localhost:3000/api/auth
app.use("/api/auth",authRoute)
export default app