import express, { Router } from 'express'
import isAuthenticated from '../../../middleware/isAuthenticated'
import categoryController from '../../../controller/institute/category/categoryController'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import { Role } from '../../../middleware/type'

const router: Router = express.Router()

router.route('/').post(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Institute), asyncErrorHandler(categoryController.createCategory))
    .get(isAuthenticated.isAuthenticated,asyncErrorHandler(categoryController.getCategories))

router.route('/:id').delete(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Institute),asyncErrorHandler(categoryController.deleteCategory))

export default router