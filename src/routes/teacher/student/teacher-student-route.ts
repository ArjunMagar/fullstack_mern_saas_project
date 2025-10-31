import express,{Router} from 'express'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import isAuthenticatedTeacher from '../../../middleware/isAuthenticatedTeacher'
import { Role } from '../../../middleware/type'
import teacherStudentController from '../../../controller/teacher/students/teacher-student-controller'




const router:Router = express.Router()


router.route('/').get(isAuthenticatedTeacher.isAuthenticated,isAuthenticatedTeacher.restrictTo(Role.Teacher),asyncErrorHandler(teacherStudentController.getStudents))

export default router