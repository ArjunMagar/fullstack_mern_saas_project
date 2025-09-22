
import express,{Router} from 'express'
import asyncErrorHandler from '../../../services/asyncErrorHandler';
import isAuthenticated from '../../../middleware/isAuthenticated';
import { Role } from '../../../middleware/type';
import studentOrderController from '../../../controller/student/order/student-order.controller';





const router:Router = express.Router()

router.route("/order").post(isAuthenticated.isAuthenticated,isAuthenticated.
    restrictTo(Role.Student),isAuthenticated.changeUserIdForTableName,asyncErrorHandler(studentOrderController.createStudentCourseOrder))

router.route("/order/khalti/verify-transaction").post(isAuthenticated.isAuthenticated,isAuthenticated.
    restrictTo(Role.Student),isAuthenticated.changeUserIdForTableName,asyncErrorHandler(studentOrderController.studentCoursePaymentVerification))


export default router;