import { Response } from "express";
import { IExtendedRequest } from "../../../middleware/type";
import sequelize from "../../../database/connection";
import User from "../../../database/models/userModel";
import { QueryTypes } from "sequelize";
import { KhaltiPayment } from "./paymentIntegration";
import axios from "axios";
import generateSha256Hash from "../../../services/generateSha256Hash";


enum PaymenntMethod {
    COD = "cod",
    ESEWA = "esewa",
    KHALTI = "khalti"
}

enum VerificationStatus {
    Completed = "Completed",
}

class StudentCourseOrder {

    async createStudentCourseOrder(req: IExtendedRequest, res: Response) {
        const userId = req.user?.id
        const notChangedUserId = req.user?.id?.split("_").join("-")
        const userData = await User.findByPk(notChangedUserId)
        const { whatsapp_no, remarks, paymentMethod, amount, orderDetails } = req.body
        console.log(orderDetails, "hello")
        const orderDetailsData: { courseId: string, instituteId: string }[] = orderDetails

        if (orderDetailsData.length === 0) return res.status(400).json({
            message: "Please! send the course you want to purchase!!!"
        })

        if (!whatsapp_no || !remarks || !paymentMethod || !amount) {
            return res.status(400).json({
                message: "Please! provide whatsapp_no, remarks, paymentMethod, amount"
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
        await sequelize.query(`CREATE TABLE IF NOT EXISTS student_order_detail_${userId}(
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            courseId VARCHAR(36),
            instituteId VARCHAR(36),
            orderId VARCHAR(36),
            FOREIGN KEY (orderId) REFERENCES student_order_${userId}(id) ON UPDATE CASCADE ON DELETE CASCADE, 
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`)

        //payment-details
        await sequelize.query(`CREATE TABLE IF NOT EXISTS student_payment_${userId}(
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            paymentMethod ENUM('esewa','khalti','cod'),
            pidx VARCHAR(150),
            transaction_uuid VARCHAR(150),
            paymentStatus ENUM('paid','pending','unpaid') DEFAULT('unpaid'),
            totalAmount VARCHAR(10) NOT NULL,
            orderId VARCHAR(36),
            FOREIGN KEY (orderId) REFERENCES student_order_${userId}(id) ON UPDATE CASCADE ON DELETE CASCADE,             
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`)
        //insert-query for order
        const data = await sequelize.query(`INSERT INTO student_order_${userId}(whatsapp_no,remarks,email)
            VALUES(?,?,?)`, {
            type: QueryTypes.INSERT,
            replacements: [whatsapp_no, remarks, userData?.email]
        })

        const [result]: {
            id: string

        }[] = await sequelize.query(`SELECT id FROM student_order_${userId} WHERE whatsapp_no=? AND remarks = ?`, {
            type: QueryTypes.SELECT,
            replacements: [whatsapp_no, remarks]

        })
        console.log(data, "Dataaa")
        console.log(result, "Result")

        //insert-query for orderDetails
        for (let orderDetail of orderDetailsData) {
            await sequelize.query(`INSERT INTO student_order_detail_${userId}(courseId,instituteId,orderId)
                VALUES(?,?,?)`, {
                type: QueryTypes.INSERT,
                replacements: [orderDetail.courseId, orderDetail.instituteId, result.id]
            })
        }

        if (paymentMethod === PaymenntMethod.ESEWA) {
            //esewa integration function call here
            const paymentData = {
                amount: amount,
                tax_amount: 0,
                product_service_charge: 0,
                product_delivery_charge: 0,
                product_code: process.env.ESEWA_PRODUCT_CODE,
                total_amount: amount,
                transaction_uuid: result.id,
                success_url: "http://localhost:3000/",
                failure_url: "http://localhost:3000/failure",
                signed_field_names: "total_amount,transaction_uuid,product_code"
            }
            const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`
            const esewaSecretKey = process.env.ESEWA_SECRET_KEY
            const signature = generateSha256Hash(data, esewaSecretKey as string)

            const response = await axios.post("https://rc-epay.esewa.com.np/api/epay/main/v2/form", {
                ...paymentData, signature
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })

            if (response.status === 200) {
                const responseUrl = response.request.res.responseUrl
                // console.log(responseUrl, "This is response url")
                const bookingId = responseUrl.split('bookingId=')[1];
                // console.log(bookingId,"Pidx/Transaction value")
                await sequelize.query(`INSERT INTO student_payment_${userId}(paymentMethod,totalAmount,orderId,pidx) VALUES(?,?,?,?)`, {
                    type: QueryTypes.INSERT,
                    replacements: [paymentMethod, amount, result.id, bookingId]
                })
                res.status(200).json({
                    message: "payment Initiated",
                    data: responseUrl
                })
            } else {
                res.status(500).json({
                    message: "Something went wrong,try again !!"
                })
            }

        } else if (paymentMethod === PaymenntMethod.KHALTI) {
            //khalti integration function call here
            const response = await KhaltiPayment({
                amount: amount,
                return_url: "http://localhost:3000/",
                website_url: "http://localhost:3000/",
                purchase_order_id: result.id,
                purchase_order_name: "Order_" + result.id
            })
            if (response.status === 200) {
                const pidx = response.data.pidx
                await sequelize.query(`INSERT INTO student_payment_${userId}(paymentMethod,totalAmount,orderId,pidx) VALUES(?,?,?,?)`, {
                    type: QueryTypes.INSERT,
                    replacements: [paymentMethod, amount, result.id, pidx]
                })
                res.status(200).json({
                    message: "Takethis",
                    data: response.data
                })
            } else {
                res.status(500).json({
                    message: "Something went wrong,try again !!"
                })
            }



        } else if (paymentMethod === PaymenntMethod.COD) {

            //cod integration function call here
        } else {

            //stripe integration function call here
        }

    }

    async studentCoursePaymentVerification(req: IExtendedRequest, res: Response) {
        const { pidx } = req.body
        const userId = req.user?.id
        if (!pidx) return res.status(400).json({ message: "Please provide pidx" })
        const response = await axios.post("https://dev.khalti.com/api/v2/epayment/lookup/", { pidx }, {
            headers: {
                Authorization: "Key 23969b194dec40ea957208808bb42996",
                "Content-Type": "application/json",
            }
        })
        const data = response.data
        if (data.status === VerificationStatus.Completed) {
            await sequelize.query(`UPDATE student_payment_${userId} SET paymentStatus=?, transaction_uuid=? WHERE pidx=?`, {
                type: QueryTypes.UPDATE,
                replacements: ['paid', data.transaction_id, pidx]
            })
            res.status(200).json({
                message: "Payment verified successfully"
            })
        } else {
            res.status(500).json({
                message: "Payment not verified!!"
            })
        }






    }

}

export default new StudentCourseOrder