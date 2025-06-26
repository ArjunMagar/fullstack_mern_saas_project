import express, { Router, Request } from 'express'
import isAuthenticated from '../../../middleware/isAuthenticated'
import { Role } from '../../../middleware/type'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import courseController from '../../../controller/institute/course/courseController'
// import { multer, storage } from '../../../middleware/multerMiddleware'
// const upload = multer({ storage: storage })
const router: Router = express.Router()

//callback function - cb(error,success), cb(error)
import multer from 'multer'
import { cloudinary, storage } from '../../../services/cloudinaryConfig'
const upload = multer({
    storage: storage,
    fileFilter: (req: Request, file: Express.Multer.File, cb) => {
        const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg']
        if (allowedFileTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("only image support garxa hai!!!"))
        }
    },
    limits: {
        fileSize: 2 * 1024 * 1024  //2mb
    }
})


router.route('/').post(isAuthenticated.isAuthenticated, isAuthenticated.restrictTo(Role.Institute), upload.single('courseImage'), asyncErrorHandler(courseController.createCourse))
    .get(isAuthenticated.isAuthenticated,asyncErrorHandler(courseController.getCourses))
router.route('/:id').get(isAuthenticated.isAuthenticated,asyncErrorHandler(courseController.getCourse))
    .delete(isAuthenticated.isAuthenticated, isAuthenticated.restrictTo(Role.Institute), asyncErrorHandler(courseController.deleteCourse))

export default router
