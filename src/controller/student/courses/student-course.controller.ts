import { QueryTypes } from "sequelize"
import sequelize from "../../../database/connection"
import { IExtendedRequest } from "../../../middleware/type"
import { Response } from "express"


class StudentCourseController {

    async getCourses(req: IExtendedRequest, res: Response) {
        const studentId = req.user?.id
        const enrolledCourses: { id: string; instituteId: string }[] =
            await sequelize.query(`SELECT id,instituteId FROM student_enrollment_${studentId} WHERE status=?`,
                {
                    type: QueryTypes.SELECT,
                    replacements: ["approved"]
                }
            )
        const courses = await Promise.all(
            enrolledCourses.map(async (enrolledCourse) => {
                const [data] = await sequelize.query(
                    `SELECT enrollment.id as enrollmentId,enrollment.*,course.id as courseId,course.* FROM student_enrollment_${studentId} as enrollment 
                    JOIN course_${enrolledCourse.instituteId} as course ON enrollment.courseId = course.id WHERE enrollment.status=? AND enrollment.id=?`,
                    {
                        type: QueryTypes.SELECT,
                        replacements: ["approved", enrolledCourse.id]
                    }
                );
                const [institute] = await sequelize.query(`SELECT instituteName,institutePhoneNumber,instituteEmail FROM institute_${enrolledCourse.instituteId}`,
                    {
                        type: QueryTypes.SELECT
                    }
                )
                return { ...data, ...institute }
            })
        );
        res.status(200).json({
            message: "Student's Courses fetched",
            data: courses
        })
    }

}

export default new StudentCourseController