import { Response } from "express";
import { IExtendedRequest } from "../../../../middleware/type";
import sequelize from "../../../../database/connection";
import { QueryTypes } from "sequelize";


class ChapterLesson {

    async createChapterLesson(req: IExtendedRequest, res: Response) {
        const { chapterId } = req.params
        const instituteNumber = req.user?.currentInstituteNumber
        const { lessonName, lessonDescription, lessonVideoUrl, lessonThumbnailUrl } = req.body
        if (!lessonName || !lessonDescription || !lessonVideoUrl || !lessonThumbnailUrl) {
            return res.status(400).json({
                message: "please! provide lessonName,lessonDescription,lessonVideoUrl,lessonThumbnailUrl"
            })
        }
        //check if chapter exist or not
        const [chapter] = await sequelize.query(`SELECT * FROM course_chapter_${instituteNumber} WHERE id=?`, {
            replacements: [chapterId],
            type: QueryTypes.SELECT
        })
        if (!chapter) {
            return res.status(404).json({
                message: "No chapter found with that id"
            })
        }

        const [chapterLesson] = await sequelize.query(`SELECT * FROM chapter_lesson_${instituteNumber} WHERE lessonName=? AND chapterId=?`, {
            replacements: [lessonName, chapterId],
            type: QueryTypes.SELECT
        })
        if (chapterLesson) {
            return res.status(400).json({
                message: "Already exist with that lessonName in that chapter"
            })
        }

        await sequelize.query(`INSERT INTO chapter_lesson_${instituteNumber}(lessonName,lessonDescription,lessonVideoUrl,lessonThumbnailUrl,
            chapterId) VALUES(?,?,?,?,?)`, {
            replacements: [lessonName, lessonDescription, lessonVideoUrl, lessonThumbnailUrl, chapterId],
            type: QueryTypes.INSERT
        })
        const [data] = await sequelize.query(`SELECT * FROM chapter_lesson_${instituteNumber} WHERE lessonName=? AND chapterId=?`, {
            replacements: [lessonName, chapterId],
            type: QueryTypes.SELECT
        })
        res.status(201).json({
            message: "lesson added to chapter",
            data
        })

    }

    async fetchChapterLesson(req: IExtendedRequest, res: Response) {
        const { chapterId } = req.params
        const instituteNumber = req.user?.currentInstituteNumber
        if (!chapterId) return res.status(400).json({ message: "please! provide chapterId" })
        const data = await sequelize.query(`SELECT * FROM chapter_lesson_${instituteNumber} WHERE chapterId=?`, {
            type: QueryTypes.SELECT,
            replacements: [chapterId]
        })

        res.status(200).json({
            message: "Lesson fetched",
            data
        })


    }
}


export default new ChapterLesson