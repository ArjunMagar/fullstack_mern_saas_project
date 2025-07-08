import express,{Router} from 'express'
import asyncErrorHandler from '../../services/asyncErrorHandler'
import teacherController from '../../controller/teacher/teacherController'

const router:Router = express.Router()


router.route('/login').post(asyncErrorHandler(teacherController.teacherLogin))

export default router