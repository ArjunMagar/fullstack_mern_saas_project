import { Request, Response } from "express";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";


class StudentInstitute {

    async instituteListForStudent(req: Request, res: Response) {

        const tables = await sequelize.query(`SHOW TABLES LIKE 'institute_%'`, {
            type: QueryTypes.SHOWTABLES
        })
        let allDatas = []
        for (let table of tables) {
            const instituteNumber = table.split("_")[1]
            const [data] = await sequelize.query(`SELECT id,instituteName,institutePhoneNumber FROM ${table}`, {
                type: QueryTypes.SELECT
            })
            allDatas.push({ instituteNumber: instituteNumber, ...data })
        }
        // console.log(allDatas, "all data...")
        res.status(200).json({
            message: "data fetched",
            data: allDatas
        })
    }

    async instituteCourseListForStudent(req: Request, res: Response) {

        const { instituteId } = req.params
        const datas = await sequelize.query(`SELECT course.id AS courseId,category.id AS categoryId,course.*,category.* FROM 
            course_${instituteId} as course JOIN category_${instituteId} as category ON course.categoryId = category.id`,
            {
                type: QueryTypes.SELECT
            })
        if (datas.length === 0) {
            res.status(404).json({
                message: "No courses found of that institute"
            })
        } else {
            res.status(200).json({
                message: "Courses fetched",
                data: datas
            })
        }

    }

}


export default new StudentInstitute