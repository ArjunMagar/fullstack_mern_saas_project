import { Request, response, Response } from "express";
import sequelize from "../../database/connection";
import generateRandomInstituteNumber from "../../services/generateRandomInstituteNumber";
import { AuthRequest } from "../../middleware/isAuthenticated";
import User from "../../database/models/userModel";
import { QueryTypes } from "sequelize";

class InstituteController {
  static async createInstitute(req: AuthRequest, res: Response): Promise<void> {

    // check validation 
    const userId = req.user?.id;
    if (!req.body) {
      res.status(409).json({
        message: "No data received",
      });
      return;
    }
    // check validation
    const {
      instituteName,
      instituteEmail,
      institutePhoneNumber,
      instituteAddress,
    } = req.body;
    const instituteVatNo = req.body.instituteVatNo || null;
    const institutePanNo = req.body.institutePanNo || null;
    // check validation 
    if (
      !instituteName ||
      !instituteEmail ||
      !institutePhoneNumber ||
      !instituteAddress
    ) {
      res.status(400).json({
        message:
          "Please provide instituteName, instituteEmail, institutePhoneNumber, instituteAddress ",
      });
      return;
    }
    // check validation
    if (!instituteVatNo && !institutePanNo) {
      res.status(400).json({
        message: "Please provider instituteVatNo or institutePanNo",
      });
      return;
    }
    const instituteNumber = generateRandomInstituteNumber();

    // To create userInstitutes History table
    await sequelize.query(`CREATE TABLE IF NOT EXISTS userInstitutes(
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
        userId CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
        instituteNumber INT NOT NULL,  
        FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    )`)

    // To check allow that how many times for creating institute by one user
    const data = await sequelize.query(`SELECT * FROM userInstitutes WHERE userId = ?`, {
      replacements: [userId],
      type : QueryTypes.SELECT
    })
    if (data.length >= 1) {
      res.status(404).json({
        message: "You have already created a institute with that email id"
      })
      return;
    }
    //Transaction applied
    const transaction = await sequelize.transaction()
    try {
      //To create institute query
      await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${instituteNumber} (
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            instituteName VARCHAR(255) NOT NULL,
            instituteEmail VARCHAR(255) NOT NULL UNIQUE,
            institutePhoneNumber VARCHAR(255) NOT NULL UNIQUE,
            instituteAddress VARCHAR(255) NOT NULL,
            instituteVatNo VARCHAR(255),
            institutePanNo VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`);

      // To insert datas in instituteTable
      await sequelize.query(
        `INSERT INTO institute_${instituteNumber} (instituteName,
      instituteEmail,institutePhoneNumber,instituteAddress,instituteVatNo,institutePanNo) VALUES (?,?,?,?,?,?)`,
        {
          replacements: [
            instituteName,
            instituteEmail,
            institutePhoneNumber,
            instituteAddress,
            instituteVatNo,
            institutePanNo,
          ],
          transaction: transaction
        }
      );

      //To create teacherTable
      await sequelize.query(`CREATE TABLE IF NOT EXISTS teacher_${instituteNumber} (
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      teacherName VARCHAR(255) NOT NULL,
      teacherEmail VARCHAR(255) NOT NULL UNIQUE,
      teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE
      )`)

      //To create studentTable
      await sequelize.query(`CREATE TABLE IF NOT EXISTS student_${instituteNumber} (
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      studentName VARCHAR(255) NOT NULL,
      studentEmail VARCHAR(255) NOT NULL,
      studentPhoneNumber VARCHAR(255) NOT NULL
      )`)

      //To create courseTable
      await sequelize.query(`CREATE TABLE IF NOT EXISTS course_${instituteNumber} (
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      courseName VARCHAR(255) NOT NULL,
      coursePrice VARCHAR(255) NOT NULL
      )`)

      // Insert data in userInstitute History tracking 
      await sequelize.query(`INSERT INTO userInstitutes(userId,instituteNumber)VALUES(?,?)`, {
        replacements: [userId, instituteNumber],
        transaction: transaction
      })

      // Current instituteNumber tracking
      if (req.user) {
        const user = await User.findByPk(req.user.id)
        if (user) {
          await User.update({
            currentInstituteNumber: instituteNumber,

          }, {
            where: {
              id: req.user.id
            },
            transaction: transaction
          })
        }
      }

      await transaction.commit();

      console.log("unmanaged transcation has been done")
      res.status(200).json({
        message: "Institute created!",
      });

    } catch (error) {
      console.log("unmanaged transcation has been rolledback due to error", error)
      await transaction.rollback();
      await sequelize.query(`DROP TABLE IF EXISTS institute_${instituteNumber};`)
      await sequelize.query(`DROP TABLE IF EXISTS teacher_${instituteNumber};`)
      await sequelize.query(`DROP TABLE IF EXISTS student_${instituteNumber};`)
      await sequelize.query(`DROP TABLE IF EXISTS course_${instituteNumber};`)
      res.status(500).json({
        message: "Institute create failed...!, Try again...!"
      })
    }

  }
}

export default InstituteController;
