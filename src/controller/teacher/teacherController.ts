import { QueryTypes } from "sequelize";
import sequelize from "../../database/connection";
import { IExtendedRequest } from "../../middleware/type";
import { Response } from 'express'
import bcrypt from 'bcrypt'
import generateToken from "../../services/generateToken";

interface ITeacherData {
    id: string
    teacherPassword: string,
    role:string,
    name:string
}


class TeacherController {

    async teacherLogin(req: IExtendedRequest, res: Response) {

        const { teacherEmail, teacherPassword, teacherInstituteNumber } = req.body
        if (!teacherEmail || !teacherPassword || !teacherInstituteNumber) {
            res.status(400).json({
                message: "Please! provide teacherEmail,teacherPassword,teacherInstituteNumber"
            })
            return
        }
        const teacherData: ITeacherData[] = await sequelize.query(`SELECT * FROM teacher_${teacherInstituteNumber} WHERE teacherEmail=?`, {
            type: QueryTypes.SELECT,
            replacements: [teacherEmail]
        })
        if (teacherData.length == 0) {
            res.status(404).json({
                message: "Invalid Email!!"
            })
            return
        }
        // check password now
        const isPasswordMatched = bcrypt.compareSync(teacherPassword, teacherData[0].teacherPassword)
        if (!isPasswordMatched) {
            res.status(400).json({
                message: "Invalid Password"
            })

        } else {
            // token generation
            const token = generateToken({id:teacherData[0].id,instituteNumber:teacherInstituteNumber,name:teacherData[0].name,role:teacherData[0].role})
            res.status(200).json({
                message: "Teacher logged in",
                data:{
                    teacherToken: token,
                    teacherInstituteNumber,
                    teacherEmail
                }
            })

        }

    }

}

export default new TeacherController