import { QueryTypes } from "sequelize"
import sequelize from "../../../database/connection"
import { IExtendedRequest } from "../../../middleware/type"
import { Response } from "express"


class TeacherStudentController {

    async getStudents(req: IExtendedRequest, res: Response) {
        const teacherId = req.user?.id
        const instituteNumber = req.user?.currentInstituteNumber
        if (!teacherId || !instituteNumber) {
            return res.status(400).json({ message: "Missing teacherId or instituteNumber" });
        }
        const tables = await sequelize.query(`SHOW TABLES LIKE 'student_enrollment_%'`, {
            type: QueryTypes.SHOWTABLES
        })

        let allDatas: any[] = [];
        for (let table of tables) {
            const data = await sequelize.query(`SELECT enrollment.id as enrollmentId,users.username,users.email,course.courseName,enrollment.createdAt,enrollment.updatedAt FROM \`${table}\` as enrollment
                JOIN course_${instituteNumber} as course ON enrollment.courseId = course.id 
                JOIN users ON enrollment.userId = users.id WHERE enrollment.status=? AND course.teacherId=? AND enrollment.instituteId=?`, {
                type: QueryTypes.SELECT,
                replacements: ["approved",teacherId,instituteNumber]
            })
             allDatas.push(...data);
        }
        // Run all queries in parallel for better performance
        // let allDatas: any[] = [];
        // const promises = tables.map(table =>
        //     sequelize.query(`SELECT enrollment.id as enrollmentId,users.username,users.email,course.courseName,enrollment.createdAt,enrollment.updatedAt FROM \`${table}\` as enrollment
        //         JOIN course_${instituteNumber} as course ON enrollment.courseId = course.id 
        //         JOIN users ON enrollment.userId = users.id WHERE enrollment.status=? AND course.teacherId=? AND enrollment.instituteId=?`, {
        //         type: QueryTypes.SELECT,
        //         replacements: ["approved", teacherId, instituteNumber]
        //     })

        // );
        // const results = await Promise.all(promises);
        // allDatas = results.flat(); // merge all arrays

        res.status(200).json({
            message: "Students fetched",
            data: allDatas
        })
    }

}
export default new TeacherStudentController



//   enrollment.*,enrollment.id as enrollmentId,course.*,course.id as courseId,users.*,users.id as userId