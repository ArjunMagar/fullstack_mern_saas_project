import express, { Router } from 'express'
import InstituteController from '../../controller/institute/instituteController'
import isAuthenticated from '../../middleware/isAuthenticated'
import { Role } from '../../middleware/type'
import asyncErrorHandler from '../../services/asyncErrorHandler'


const router:Router = express.Router()

router.route("/").post(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Institute),asyncErrorHandler(InstituteController.createInstitute))


export default router