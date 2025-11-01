import express,{Router} from 'express'
import asyncErrorHandler from '../../../../services/asyncErrorHandler'
import isAuthenticated from '../../../../middleware/isAuthenticated'
import { Role } from '../../../../middleware/type'
import studentLessonController from '../../../../controller/student/courses/lessons/student-lesson.controller'


const router:Router = express.Router()


router.route('/:chapterId/lessons/')
.get(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Student),isAuthenticated.changeUserIdForTableName,asyncErrorHandler(studentLessonController.fetchChapterLessons))

router.route('/lessons/:lessonId')
.get(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Student),isAuthenticated.changeUserIdForTableName,asyncErrorHandler(studentLessonController.fetchChapterLesson))


export default router