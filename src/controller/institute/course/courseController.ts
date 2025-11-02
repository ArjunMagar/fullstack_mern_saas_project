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
        const { courseName, coursePrice, courseDescription, courseDuration, courseLevel, categoryId } = req.body
        if (!courseName || !coursePrice || !courseDescription || !courseDuration || !courseLevel || !categoryId) {
            res.status(400).json({
                message: "Please ! provide courseName,coursePrice,courseDescription,courseDuration,courseLevel"
            })
            return
        }
        const courseThumbnail = req.file ? req.file.path : null

        await sequelize.query(`INSERT INTO course_${instituteNumber}(courseName,coursePrice,
        courseDescription,courseDuration,courseLevel,courseThumbnail,categoryId) VALUES (?,?,?,?,?,?,?)`, {
            replacements: [courseName, coursePrice, courseDescription, courseDuration, courseLevel, courseThumbnail, categoryId],
            type: QueryTypes.INSERT
        })
        const [newCourse] = await sequelize.query(`SELECT course.id as courseId,category.id as categoryId,course.*,category.* FROM
             course_${instituteNumber} as course JOIN category_${instituteNumber} as category ON course.categoryId = category.id WHERE course.courseName = ?`,
            {
                replacements: [courseName],
                type: QueryTypes.SELECT
            })
        res.status(201).json({
            message: "Course created successfully",
            data: newCourse
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
        const courses = await sequelize.query(`SELECT course.id AS courseId,category.id AS categoryId,course.*,category.* FROM 
            course_${instituteNumber} as course JOIN category_${instituteNumber} as category ON course.categoryId = category.id`,
            {
                type: QueryTypes.SELECT
            })

        res.status(200).json({
            message: "Courses fetched",
            data: courses
        })
    }

    async getCourse(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const courseId = req.params.id
        const course = await sequelize.query(`SELECT course.id as courseId,category.id as categoryId,course.*,category.* FROM
             course_${instituteNumber} as course JOIN category_${instituteNumber} as category ON course.categoryId = category.id WHERE course.id = ?`,
            {
                replacements: [courseId],
                type: QueryTypes.SELECT
            })
        res.status(200).json({
            message: "Course fetched",
            data: course
        })
    }

    async updateCourse(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const id = req.params.id
        const { courseName, coursePrice, courseDescription, courseDuration, courseLevel, categoryId,courseImageUrl} = req.body
        const courseThumbnail = req.file ? req.file.path : courseImageUrl
        const result = await sequelize.query(`UPDATE course_${instituteNumber}
             SET courseName=?,coursePrice=?,courseDescription=?,courseDuration=?,courseLevel=?,courseThumbnail=?,categoryId=? WHERE id=?`,
            {
                type: QueryTypes.UPDATE,
                replacements: [courseName, coursePrice, courseDescription, courseDuration, courseLevel, courseThumbnail, categoryId, id]
            })
        console.log(result[1],"Result")
        if (result[1] === 1) {
            const [course] = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id=?`, {
                type: QueryTypes.SELECT,
                replacements: [id]
            })
            return res.status(200).json({
                message: "course updated successfully",
                data: course
            })
        }
        return res.status(404).json({
            message: "course update fails!"
        })


    }

}

export default new CourseController