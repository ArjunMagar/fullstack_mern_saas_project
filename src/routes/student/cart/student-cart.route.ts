import express,{Router} from 'express'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import studentCartController from '../../../controller/student/cart/student-cart.controller'
import isAuthenticated from '../../../middleware/isAuthenticated'
import { Role } from '../../../middleware/type'



const router:Router = express.Router()


router.route('/cart').post(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Student),isAuthenticated.changeUserIdForTableName,asyncErrorHandler(studentCartController.insertIntoCartTableOfStudent))
.get(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Student),isAuthenticated.changeUserIdForTableName,asyncErrorHandler(studentCartController.fetchStudentCartItems))
router.route('/cart/:id').delete(isAuthenticated.isAuthenticated,isAuthenticated.restrictTo(Role.Student),isAuthenticated.changeUserIdForTableName,asyncErrorHandler(studentCartController.deleteStudentCartItem))
export default router