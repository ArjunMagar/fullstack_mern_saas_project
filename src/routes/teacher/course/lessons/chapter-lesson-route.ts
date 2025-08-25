import express,{Router} from 'express'
import asyncErrorHandler from '../../../../services/asyncErrorHandler'
import isAuthenticated from '../../../../middleware/isAuthenticated'
import lessonController from '../../../../controller/teacher/courses/lessons/lesson-controller'


const router:Router = express.Router()


router.route('/:chapterId/lessons').post(isAuthenticated.isAuthenticated,asyncErrorHandler(lessonController.createChapterLesson))
.get(isAuthenticated.isAuthenticated,asyncErrorHandler(lessonController.fetchChapterLesson))

export default router