import { Response } from "express";
import { IExtendedRequest } from "../../../middleware/type";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";



class StudentCart {

    async insertIntoCartTableOfStudent(req: IExtendedRequest, res: Response) {
        const userId = req.user?.id
        // const newUserId = userId?.split("-").join("_")
        const { instituteId, courseId } = req.body
        if (!instituteId || !courseId) {
            return res.status(400).json({
                message: "Please provide instituteId,courseId"
            })
        }
        await sequelize.query(`CREATE TABLE IF NOT EXISTS student_cart_${userId}(
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            instituteId VARCHAR(36),
            courseId VARCHAR(36),
            FOREIGN KEY (courseId) REFERENCES course_${instituteId}(id) ON UPDATE CASCADE ON DELETE CASCADE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`)

        await sequelize.query(`INSERT INTO student_cart_${userId}(courseId,instituteId) VALUES(?,?)`, {
            type: QueryTypes.INSERT,
            replacements: [courseId, instituteId]
        })
        res.status(200).json({
            message: "Course added to cart"
        })
    }
    async fetchStudentCartItems(req: IExtendedRequest, res: Response) {
        const userId = req.user?.id
        // const newUserId = userId?.split("-").join("_")

        let cartData = []
        const datas: { instituteId: string, courseId: string }[] = await sequelize.query(`SELECT instituteId,courseId FROM student_cart_${userId}`, {
            type: QueryTypes.SELECT
        })
        // console.log(datas, 'test')
        for (let data of datas) {
            const courseData = await sequelize.query(`SELECT course.id AS courseId,category.id AS categoryId,course.*,category.* FROM course_${data.instituteId} as course JOIN
                category_${data.instituteId} as category ON course.categoryId = category.id  WHERE course.id='${data.courseId}'`,
                {
                    type: QueryTypes.SELECT
                }
            )
            // const courseData = await sequelize.query(`SELECT * FROM course_${data.instituteId} WHERE id = :courseId`,      
            //     {
            //         replacements: { courseId: data.courseId },
            //         type: QueryTypes.SELECT
            //     }
            // )
            cartData.push(...courseData)
        }

        if (datas.length === 0) {
            res.status(404).json({
                message: "No item in the cart"
            })
        } else {
            res.status(200).json({
                message: "Cart items fetched",
                data: cartData
            })
        }

    }
    async deleteStudentCartItem(req: IExtendedRequest, res: Response) {
        const userId = req.user?.id
        const cartTableId = req.params.cartTableId;
        if (!cartTableId) return res.status(400).json({
            message: "Please provide cart table id"
        })
        await sequelize.query(`DELETE FROM student_cart_${userId} WHERE cartTableId=?`, {
            type: QueryTypes.DELETE,
            replacements: [cartTableId]
        })
        res.status(200).json({
            message: "Deleted successfully"
        })

    }


}

export default new StudentCart