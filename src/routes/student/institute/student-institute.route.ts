import express,{Router} from 'express'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import studentInstituteController from '../../../controller/student/institute/student-institute.controller'


const router:Router = express.Router()


router.route('/institute').get(asyncErrorHandler(studentInstituteController.instituteListForStudent))
router.route('/institute/:instituteId/courses').get(asyncErrorHandler(studentInstituteController.instituteCourseListForStudent))
export default router