import { QueryTypes } from "sequelize";
import sequelize from "../../../../database/connection";
import { IExtendedRequest } from "../../../../middleware/type";
import { Response } from "express";

class CourseChapter{

    async addChapterToCourse(req: IExtendedRequest, res: Response) {
        const { courseId } = req.params
        const instituteNumber = req.user?.currentInstituteNumber
        const { chapterName, chapterDuration, chapterLevel } = req.body
        if (!chapterName || !chapterDuration || !chapterLevel) {
            return res.status(400).json({
                message: "please! provide chapterName,chapterDuration,chapterLevel"
            })
        }
        //check if course exist or not
        const [course] = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id = ?`, {
            replacements: [courseId],
            type: QueryTypes.SELECT
        })

        if (!course) {
            return res.status(404).json({
                message: "No course found with that id"
            })
        }

        const [courseChapter] = await sequelize.query(`SELECT * FROM course_chapter_${instituteNumber} WHERE chapterName=? AND courseId=?`, {
            replacements: [chapterName, courseId],
            type: QueryTypes.SELECT
        })
        if (courseChapter) {
            return res.status(400).json({
                message: "Already exist with that chapterName in that course"
            })
        }

        // add chapter data to chapter table
        const data = await sequelize.query(`INSERT INTO course_chapter_${instituteNumber}(chapterName,chapterDuration,chapterLevel,courseId)`, {
            replacements: [chapterName, chapterDuration, chapterLevel, courseId]
        })

        res.status(200).json({
            message: "Chapter added successfully"
        })
    }

    async fetchCourseChapter(req: IExtendedRequest, res: Response) {
        const { courseId } = req.params
        const instituteNumber = req.user?.currentInstituteNumber
        if (!courseId) return res.status(400).json({ message: "Please provide courseId" })
        const [data] = await sequelize.query(`SELECT * FROM course_chapter_${instituteNumber} WHERE courseId=?`, {
            replacements: [courseId],
            type: QueryTypes.SELECT
        })
        if (data) {
            res.status(200).json({
                message: "Chapters fetched",
                data
            })
        } else {
            res.status(404).json({
                message: "Chapter not found",
                data: []
            })
        }

    }

    
}

export default new CourseChapter