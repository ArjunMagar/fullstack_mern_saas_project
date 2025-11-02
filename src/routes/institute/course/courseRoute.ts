import express, { Router } from 'express'
import isAuthenticated from '../../../middleware/isAuthenticated'
import { Role } from '../../../middleware/type'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import courseController from '../../../controller/institute/course/courseController'
// import { multer, storage } from '../../../middleware/multerMiddleware'
// const upload = multer({ storage: storage })
const router: Router = express.Router()

import upload from '../../../middleware/multerUpload'


router.route('/').post(isAuthenticated.isAuthenticated, isAuthenticated.restrictTo(Role.Institute), upload.single('courseImage'), asyncErrorHandler(courseController.createCourse))
    .get(isAuthenticated.isAuthenticated,asyncErrorHandler(courseController.getCourses))
router.route('/:id').get(isAuthenticated.isAuthenticated,asyncErrorHandler(courseController.getCourse))
    .delete(isAuthenticated.isAuthenticated, isAuthenticated.restrictTo(Role.Institute), asyncErrorHandler(courseController.deleteCourse))
    .patch(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Institute),upload.single('courseImage'),asyncErrorHandler(courseController.updateCourse))

export default router
