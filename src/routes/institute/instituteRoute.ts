import express, { Router } from 'express'
import InstituteController from '../../controller/institute/instituteController'
import isAuthenticated, { Role } from '../../middleware/isAuthenticated'

const router:Router = express.Router()

router.route("/").post(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Institute),InstituteController.createInstitute)

export default router