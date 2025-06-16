import { Request, Response } from "express";
import sequelize from "../../database/connection";
import generateRandomInstituteNumber from "../../services/generateRandomInstituteNumber";
import { AuthRequest } from "../../middleware/isAuthenticated";

class InstituteController {
  static async createInstitute(req: AuthRequest, res: Response): Promise<void> {
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
    const userId = req.user?.id;
    const sanitizedUserId = userId?.replace(/-/g, '_'); // Replace "-" with "_"

    await sequelize.query(`CREATE TABLE IF NOT EXISTS userInstitutes_${sanitizedUserId}(
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        userId CHAR(36) NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        instituteNumber  INT NOT NULL REFERENCES institute_${instituteNumber}(id) ON UPDATE CASCADE ON DELETE CASCADE
    )`)
      
    await sequelize.query(`INSERT INTO userInstitutes_${sanitizedUserId} (userId,instituteNumber)VALUES(?,?)`,{
        replacements : [userId,instituteNumber]
    })

    res.status(200).json({
      message: "Institute created!",
    });
  }
}

export default InstituteController;
