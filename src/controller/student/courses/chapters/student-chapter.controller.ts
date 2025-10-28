import { QueryTypes } from "sequelize";
import sequelize from "../../../../database/connection";
import { IExtendedRequest } from "../../../../middleware/type";
import { Response } from "express";

class StudentCourseChapter {

    async fetchCourseChapters(req: IExtendedRequest, res: Response) {
        const { courseId } = req.params
        const {instituteNumber} = req.query
        if (!courseId) return res.status(400).json({ message: "Please provide courseId" })
        const chapters = await sequelize.query(`SELECT * FROM course_chapter_${instituteNumber} WHERE courseId=?`, {
            replacements: [courseId],
            type: QueryTypes.SELECT
        })
        if (chapters.length > 0) {
            res.status(200).json({
                message: "Student Chapters fetched",
                data:{instituteNumber,chapters}
            })
        } else {
            res.status(404).json({
                message: "Student Chapter not found",
                data: []
            })
        }

    }


}

export default new StudentCourseChapter