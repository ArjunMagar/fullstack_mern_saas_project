import { Response } from "express";
import { IExtendedRequest } from "../../../../middleware/type";
import sequelize from "../../../../database/connection";
import { QueryTypes } from "sequelize";


class ChapterLesson {

    async createChapterLesson(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const { lessonName, lessonDescription, lessonVideoUrl, lessonThumbnailUrl, chapterId } = req.body
        if (!lessonName || !lessonDescription || !lessonVideoUrl || !lessonThumbnailUrl || !chapterId) {
            return res.status(400).json({
                message: "please! provide lessonName,lessonDescription,lessonVideoUrl,lessonThumbnailUrl,chapterId"
            })
        }
        await sequelize.query(`INSERT INTO chapter_lesson_${instituteNumber}(lessonName,lessonDescription,lessonVideoUrl,lessonThumbnailUrl,
            chapterId) VALUES(?,?,?,?,?)`, {
            replacements: [lessonName, lessonDescription, lessonVideoUrl, lessonThumbnailUrl, chapterId],
            type: QueryTypes.INSERT
        })
        res.status(200).json({
            message: "lesson added to chapter"
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
            message: "lessons fetched",
            data
        })

    }
}


export default new ChapterLesson