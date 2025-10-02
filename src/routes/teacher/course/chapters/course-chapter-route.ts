import express,{Router} from 'express'
import asyncErrorHandler from '../../../../services/asyncErrorHandler'
import chapterController from '../../../../controller/teacher/courses/chapters/chapter-controller'
import { Role } from '../../../../middleware/type'
import isAuthenticatedTeacher from '../../../../middleware/isAuthenticatedTeacher'


const router:Router = express.Router()


router.route('/:courseId/chapters/').post(isAuthenticatedTeacher.isAuthenticated,isAuthenticatedTeacher.restrictTo(Role.Teacher),asyncErrorHandler(chapterController.addChapterToCourse))
.get(isAuthenticatedTeacher.isAuthenticated,asyncErrorHandler(chapterController.fetchCourseChapter))

export default router