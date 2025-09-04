import { Response } from "express";
import { IExtendedRequest } from "../../../middleware/type";
import sequelize from "../../../database/connection";
import User from "../../../database/models/userModel";
import { QueryTypes } from "sequelize";

class StudentCourseOrder {

    async createStudentCourseOrder(req: IExtendedRequest, res: Response) {
        const userId = req.user?.id
        const userData = await User.findByPk(userId)
        const { whatsapp_no, remarks } = req.body
        const orderDetailsData: {
            courseId: string,
            instituteId: string
        }[] = req.body
        if (orderDetailsData.length === 0) return res.status(400).json({
            message: "Please! send the course you want to purchase!!!"
        })

        if (!whatsapp_no || !remarks) {
            return res.status(400).json({
                message: "Please! provide whatsapp_no, remarks"
            })
        }
        //order
        await sequelize.query(`CREATE TABLE IF NOT EXISTS student_order_${userId}(
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            email VARCHAR(25) NOT NULL,
            whatsapp_no VARCHAR(26) NOT NULL,
            remarks TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`)

        //order-details
        await sequelize.query(`CREATE TABLE IF NOT EXISTS student_order_details_${userId}(
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            courseId VARCHAR(36),
            instituteId VARCHAR(36),
            orderId VARCHAR(36) NOT NULL,
            FOREIGN KEY (orderId) REFERENCES student_order_${userId}(id) ON UPDATE CASCADE ON DELETE CASCADE, 
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`)

        //payment-details
        await sequelize.query(`CREATE TABLE IF NOT EXISTS student_payment_${userId}(
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            paymentMethod ENUM('esewa','khalti','cod'),
            paymentStatus ENUM('paid','pending','unpaid'),
            totalAmount VARCHAR(10) NOT NULL,
            orderId VARCHAR(36) NOT NULL,
            FOREIGN KEY (orderId) REFERENCES student_order_${userId}(id) ON UPDATE CASCADE ON DELETE CASCADE,             
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`)
        //insert-query for order
        const data = await sequelize.query(`INSERT INTO student_order_${userId}(whatsapp_no,email,remark)
            VALUES(?,?,?)`, {
            type: QueryTypes.INSERT,
            replacements: [whatsapp_no, remarks, userData?.email]
        })
        //insert-query for orderDetails
        for (let orderDetail of orderDetailsData) {
            await sequelize.query(`INSERT INTO student_order_details_${userId}(courseId,instituteId,orderId)
                VALUES(?,?,?)`, {
                type: QueryTypes.INSERT,
                replacements: [orderDetail.courseId, orderDetail.instituteId, 12325]
            })
        }



    }

}

export default new StudentCourseOrder