import express,{Router} from 'express'
import asyncErrorHandler from '../../../../services/asyncErrorHandler'
import lessonController from '../../../../controller/teacher/courses/lessons/lesson-controller'
import isAuthenticatedTeacher from '../../../../middleware/isAuthenticatedTeacher'
import { Role } from '../../../../middleware/type'


const router:Router = express.Router()


router.route('/:chapterId/lessons').post(isAuthenticatedTeacher.isAuthenticated,isAuthenticatedTeacher.restrictTo(Role.Teacher),asyncErrorHandler(lessonController.createChapterLesson))
.get(isAuthenticatedTeacher.isAuthenticated,asyncErrorHandler(lessonController.fetchChapterLesson))

export default router