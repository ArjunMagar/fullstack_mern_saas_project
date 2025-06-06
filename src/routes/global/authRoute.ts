import express, { Router } from 'express'
import AuthController from '../../controller/global/authController'
import googleAuthController from '../../controller/global/googleAuthController'

const router:Router = express.Router()

router.route("/register").post(AuthController.register)
router.route("/login").post(AuthController.login)
router.route("/google").get(googleAuthController.login)
router.route("/callback/google").get(googleAuthController.callback)

export default router