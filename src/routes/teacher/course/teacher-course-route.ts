import express,{Router} from 'express'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import teacherCourseController from '../../../controller/teacher/courses/teacher-course-controller'
import isAuthenticatedTeacher from '../../../middleware/isAuthenticatedTeacher'
import { Role } from '../../../middleware/type'




const router:Router = express.Router()


router.route('/').get(isAuthenticatedTeacher.isAuthenticated,isAuthenticatedTeacher.restrictTo(Role.Teacher),asyncErrorHandler(teacherCourseController.getCourses))

export default router