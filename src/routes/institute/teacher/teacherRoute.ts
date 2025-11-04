import express,{Router} from 'express'
import isAuthenticated from '../../../middleware/isAuthenticated'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import teacherController from '../../../controller/institute/teacher/teacherController'
import { Role } from '../../../middleware/type'
import upload from '../../../middleware/multerUpload'

const router:Router = express.Router()

router.route('/').post(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Institute),upload.single('teacherPhoto'),asyncErrorHandler(teacherController.createTeacher))
.get(isAuthenticated.isAuthenticated,asyncErrorHandler(teacherController.getTeachers))
router.route('/:id').delete(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Institute),asyncErrorHandler(teacherController.deleteTeacher))
.patch(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Institute),upload.single('teacherPhoto'),asyncErrorHandler(teacherController.updateTeacher))
export default router