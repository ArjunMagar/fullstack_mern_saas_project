import express,{Router} from 'express'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import isAuthenticated from '../../../middleware/isAuthenticated'
import { Role } from '../../../middleware/type'
import studentCourseController from '../../../controller/student/courses/student-course.controller'



const router:Router = express.Router()


router.route('/').get(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Student),isAuthenticated.changeUserIdForTableName,asyncErrorHandler(studentCourseController.getCourses))


export default router