import { Request, Response, NextFunction } from 'express'
import sequelize from '../../../database/connection'
import { IExtendedRequest } from '../../../middleware/type'
import { QueryTypes } from 'sequelize';



class CourseController {

    async createCourse(req: IExtendedRequest, res: Response): Promise<void> {
        const instituteNumber = req.user?.currentInstituteNumber

        // Validate input
        if (!req.body) {
            res.status(409).json({
                message: "No data received",
            });
            return;
        }
        const { courseName, coursePrice, courseDescription, courseDuration, courseLevel } = req.body
        if (!courseName || !coursePrice || !courseDescription || !courseDuration || !courseLevel) {
            res.status(400).json({
                message: "Please ! provide courseName,coursePrice,courseDescription,courseDuration,courseLevel"
            })
            return
        }
        const courseThumbnail = req.file ? req.file.path : null

        await sequelize.query(`INSERT INTO course_${instituteNumber}(courseName,coursePrice,
        courseDescription,courseDuration,courseLevel,courseThumbnail) VALUES (?,?,?,?,?,?)`, {
            replacements: [courseName, coursePrice, courseDescription, courseDuration, courseLevel, courseThumbnail],
            type: QueryTypes.INSERT
        })

        res.status(201).json({
            message: "course created successfully"
        })
    }

    async deleteCourse(req: IExtendedRequest, res: Response): Promise<void> {
        const instituteNumber = req.user?.currentInstituteNumber
        const courseId = req.params.id

        // first check if course exists or not, if exists --> delete else not delete
        const courseData = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id =? `, {
            replacements: [courseId],
            type: QueryTypes.SELECT
        })
        if (courseData.length === 0) {
            res.status(404).json({
                message: "no course with that id"
            })
            return
        }
        await sequelize.query(`DELETE FROM course_${instituteNumber} WHERE id = ?`, {
            replacements: [courseId],
            type: QueryTypes.DELETE
        })
        res.status(200).json({
            message: "course deleted successfully"
        })
    }

    async getCourses(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const courses = await sequelize.query(`SELECT * FROM course_${instituteNumber}`, {
            type: QueryTypes.SELECT
        })

        res.status(200).json({
            message: "Courses fetched",
            data: courses
        })
    }

    async getCourse(req: IExtendedRequest, res: Response) {
        const instituteNumber  = req.user?.currentInstituteNumber
        const courseId = req.params.id
        const course = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id = ?`, {
            replacements: [courseId],
            type: QueryTypes.SELECT
        })
        res.status(200).json({
            message: "Course fetched",
            data: course
        })
    }

}

export default new CourseController