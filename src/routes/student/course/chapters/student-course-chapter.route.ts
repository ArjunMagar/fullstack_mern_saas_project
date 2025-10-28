import express,{Router} from 'express'
import asyncErrorHandler from '../../../../services/asyncErrorHandler'
import isAuthenticated from '../../../../middleware/isAuthenticated'
import { Role } from '../../../../middleware/type'
import studentChapterController from '../../../../controller/student/courses/chapters/student-chapter.controller'


const router:Router = express.Router()


router.route('/:courseId/chapters/')
.get(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Student,Role.Visitor),isAuthenticated.changeUserIdForTableName,asyncErrorHandler(studentChapterController.fetchCourseChapters))


export default router