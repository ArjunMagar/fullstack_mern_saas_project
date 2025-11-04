import { QueryTypes } from "sequelize";
import sequelize from "../../../database/connection";
import { IExtendedRequest, Role } from "../../../middleware/type";
import { Response } from 'express'
import generateRandomPassword from "../../../services/generateRandomPassword";
import sendMail from "../../../services/sendMail";


class TeacherController {

    async createTeacher(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const { teacherName, teacherEmail, teacherPhoneNumber, teacherExpertise, teacherSalary, teacherJoinedDate, courseId } = req.body
        const teacherPhoto = req.file ? req.file.path : "https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"
        if (!teacherName || !teacherEmail || !teacherPhoneNumber || !teacherExpertise || !teacherSalary || !teacherJoinedDate || !courseId) {
            res.status(400).json({
                message: "Please! provide teacherName,teacherEmail,teacherPhoneNumber,teacherExpertise,teacherSalary,teacherJoinedDate"
            })
            return
        }
        //password generate function
        const data = generateRandomPassword(teacherName)
        // Use Transaction 
        const transaction = await sequelize.transaction()
        try {
            await sequelize.query(`INSERT INTO teacher_${instituteNumber}(teacherName,teacherEmail,teacherPhoneNumber,role,
            teacherExpertise,joinedDate,salary,teacherPhoto,teacherPassword) VALUES(?,?,?,?,?,?,?,?,?)`, {
                type: QueryTypes.INSERT,
                replacements: [teacherName, teacherEmail, teacherPhoneNumber, Role.Teacher, teacherExpertise, teacherJoinedDate, teacherSalary, teacherPhoto, data.hashedVersion],
                transaction: transaction
            })

            const teacherData: { id: string }[] = await sequelize.query(`SELECT * FROM teacher_${instituteNumber} WHERE teacherEmail=?`, {
                type: QueryTypes.SELECT,
                replacements: [teacherEmail],
                transaction: transaction
            })

            const updatedData = await sequelize.query(`UPDATE course_${instituteNumber} SET teacherId=? WHERE id=?`, {
                type: QueryTypes.UPDATE,
                replacements: [teacherData[0].id, courseId],
                transaction: transaction
            })

            // console.log(updatedData[1],"updateDAta")
            if (updatedData[1] === 0) {
                await transaction.rollback();
                res.status(404).json({
                    message: "No course related with the teacher, Please! check"
                })
                return
            }
            //send mail function goes here
            const mailInformation = {
                to: teacherEmail,
                subject: "welcome to our saas mern project",
                text: `welcom xa hai, Email: ${teacherEmail}, Password: ${data.plainVersion}, Your InstituteNumber: ${instituteNumber}`
            }
            await sendMail(mailInformation)

            await transaction.commit();
            console.log("unmanaged transcation has been done")

            res.status(201).json({
                message: "teacher created",
                data: teacherData
            })
        } catch (error) {
            console.log("unmanaged transcation has been rolledback due to error", error)
            await transaction.rollback();
            res.status(500).json({
                message: "Teacher create failed...!, Try again...!"
            })

        }

    }

    async getTeachers(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const teachers = await sequelize.query(`SELECT * FROM teacher_${instituteNumber}`, {
            type: QueryTypes.SELECT
        })
        res.status(200).json({
            message: "teachers fetched",
            data: teachers
        })
    }

    async deleteTeacher(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const id = req.params.id
        await sequelize.query(`DELETE FROM teacher_${instituteNumber} WHERE id=?`, {
            type: QueryTypes.DELETE,
            replacements: [id]
        })
        res.status(200).json({
            message: "teacher deleted successfully"
        })
    }

    async updateTeacher(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const id = req.params.id
        const { teacherName, teacherEmail, teacherPhoneNumber, teacherExpertise, teacherSalary, teacherJoinedDate, courseId, teacherPhotoUrl } = req.body
        const teacherPhoto = req.file ? req.file.path : teacherPhotoUrl
        const teacherUpdate = await sequelize.query(`UPDATE teacher_${instituteNumber} SET teacherName=?,teacherEmail=?,teacherPhoneNumber=?,
            teacherExpertise=?,joinedDate=?,salary=?,teacherPhoto=? WHERE id=?`,
            {
                type: QueryTypes.UPDATE,
                replacements: [teacherName, teacherEmail, teacherPhoneNumber, teacherExpertise, teacherJoinedDate, teacherSalary, teacherPhoto, id]
            })
        // console.log(teacherUpdate[1], "teacherUpdate")

        const courseTeacherUpdate = await sequelize.query(`UPDATE course_${instituteNumber} SET teacherId=? WHERE id=?`, {
            type: QueryTypes.UPDATE,
            replacements: [id, courseId],

        })
        // console.log(courseTeacherUpdate[1], "courseTeacherUpdate")
        if (teacherUpdate[1] === 1 || courseTeacherUpdate[1] === 1) {
            const teacherData = await sequelize.query(`SELECT * FROM teacher_${instituteNumber} WHERE id=?`, {
                type: QueryTypes.SELECT,
                replacements: [id],

            })

            return res.status(200).json({
                message: "teacher updated successfully",
                data: teacherData
            })
        }
        return res.status(404).json({
            message: "teacher update fails!"
        })


    }
}

export default new TeacherController