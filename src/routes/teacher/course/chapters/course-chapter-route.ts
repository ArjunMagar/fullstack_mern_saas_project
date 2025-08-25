import express,{Router} from 'express'
import asyncErrorHandler from '../../../../services/asyncErrorHandler'
import chapterController from '../../../../controller/teacher/courses/chapters/chapter-controller'
import isAuthenticated from '../../../../middleware/isAuthenticated'
import { Role } from '../../../../middleware/type'


const router:Router = express.Router()


router.route('/:courseId/chapters/').post(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Teacher),asyncErrorHandler(chapterController.addChapterToCourse))
.get(isAuthenticated.isAuthenticated,asyncErrorHandler(chapterController.fetchCourseChapter))

export default router