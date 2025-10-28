import { QueryTypes } from "sequelize";
import sequelize from "../../../../database/connection";
import { IExtendedRequest } from "../../../../middleware/type";
import { Response } from "express";


class StudentChapterLesson {

    async fetchChapterLessons(req: IExtendedRequest, res: Response) {
        const { chapterId } = req.params
        const { instituteNumber } = req.query
        if (!chapterId) return res.status(400).json({ message: "please! provide chapterId" })
        const lessons = await sequelize.query(`SELECT * FROM chapter_lesson_${instituteNumber} WHERE chapterId=?`, {
            type: QueryTypes.SELECT,
            replacements: [chapterId]
        })

        res.status(200).json({
            message: "Student Lessons fetched",
            data: { instituteNumber, lessons }
        })
    }
    
    async fetchChapterLesson(req: IExtendedRequest, res: Response) {
        const { lessonId } = req.params
        const { instituteNumber } = req.query
        if (!lessonId) return res.status(400).json({ message: "please! provide lessonId" })
        const data = await sequelize.query(`SELECT * FROM chapter_lesson_${instituteNumber} WHERE id=?`, {
            type: QueryTypes.SELECT,
            replacements: [lessonId]
        })

        res.status(200).json({
            message: "Student Lesson fetched",
            data
        })
    }
}


export default new StudentChapterLesson