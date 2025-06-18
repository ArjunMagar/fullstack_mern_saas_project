import { Request, Response } from "express";
import sequelize from "../../database/connection";
import generateRandomInstituteNumber from "../../services/generateRandomInstituteNumber";
import { AuthRequest } from "../../middleware/isAuthenticated";
import User from "../../database/models/userModel";

class InstituteController {
  static async createInstitute(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!req.body) {
      res.status(409).json({
        message: "No data received",
      });
      return;
    }

    const {
      instituteName,
      instituteEmail,
      institutePhoneNumber,
      instituteAddress,
    } = req.body;
    const instituteVatNo = req.body.instituteVatNo || null;
    const institutePanNo = req.body.institutePanNo || null;
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
    if (!instituteVatNo && !institutePanNo) {
      res.status(400).json({
        message: "Please provider instituteVatNo or institutePanNo",
      });
      return;
    }
    const instituteNumber = generateRandomInstituteNumber();

    // To create userInstitutes table
    await sequelize.query(`CREATE TABLE IF NOT EXISTS userInstitutes(
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
        userId CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
        instituteNumber INT NOT NULL,  
        FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    )`)

    // To check for creating institute by one user
    const [data] = await sequelize.query(`SELECT * FROM userInstitutes WHERE userId = ?`, {
      replacements: [userId]
    })
    
    if (data.length >= 3) {
      res.status(404).json({
        message: "Limit user to a maximum of 3 associated institutes"
      })
      return;
    }
    //To create institute query
    await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${instituteNumber} (
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            instituteName VARCHAR(255) NOT NULL,
            instituteEmail VARCHAR(255) NOT NULL UNIQUE,
            institutePhoneNumber VARCHAR(255) NOT NULL UNIQUE,
            instituteAddress VARCHAR(255) NOT NULL,
            instituteVatNo VARCHAR(255),
            institutePanNo VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`);

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
      }
    );

    // Insert data of userInstitute History tracking 
    await sequelize.query(`INSERT INTO userInstitutes(userId,instituteNumber)VALUES(?,?)`, {
      replacements: [userId, instituteNumber]
    })
    // current instituteNumber tracking
    if (req.user) {
      const user = await User.findByPk(req.user.id)
      if (user) {
        await User.update({
          currentInstituteNumber: instituteNumber
        }, {
          where: {
            id: req.user.id
          }
        })
      }

    }

    res.status(200).json({
      message: "Institute created!",
    });

  }
}

export default InstituteController;
