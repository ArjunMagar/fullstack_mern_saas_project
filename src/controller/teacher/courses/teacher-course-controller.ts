import { QueryTypes } from "sequelize"
import sequelize from "../../../database/connection"
import { IExtendedRequest } from "../../../middleware/type"
import { Response } from "express"


class TeacherCourseController {

    async getCourses(req: IExtendedRequest, res: Response) {
        const teacherId = req.user?.id
        const instituteNumber = req.user?.currentInstituteNumber
        if (!teacherId || !instituteNumber) {
            return res.status(400).json({ message: "Missing teacherId or instituteNumber" });
        }
        const courses = await sequelize.query(`SELECT course.id AS courseId,category.id AS categoryId,course.*,category.* FROM 
            course_${instituteNumber} as course JOIN category_${instituteNumber} as category ON course.categoryId = category.id WHERE teacherId=?`,
            {
                type: QueryTypes.SELECT,
                replacements: [teacherId]
            })

        res.status(200).json({
            message: "Courses fetched",
            data: courses
        })
    }

}

export default new TeacherCourseController