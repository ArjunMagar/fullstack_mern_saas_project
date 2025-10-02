import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/config";
import User from "../database/models/userModel";
import { IExtendedRequest, Role } from "./type";
import sequelize from "../database/connection";
import { QueryTypes } from "sequelize";


class AuthMiddleware {

    async isAuthenticated(req: IExtendedRequest, res: Response, next: NextFunction): Promise<void> {
        //get token from user
        const token = req.headers.authorization;
        if (!token || token === undefined || token === "" || token === null) {
            res.status(400).json({
                message: "Token not provided",
            });
            return;
        }

        // verify token if it is legit or tampered
        jwt.verify(token, envConfig.jwtSecretKey, async (err, decoded: any) => {
            if (err) {
                res.status(403).json({
                    message: "Invalid Token",
                });
            } else {
                console.log(decoded,"Decodevalue..")
                //check if that decoded object id user exist or not
                try {
                    // const userData = await User.findByPk(decoded.id, {
                    //     attributes: ['id', 'role', 'currentInstituteNumber']
                    // });
                    const [userData] = await sequelize.query(`SELECT id,role FROM teacher_${decoded.instituteNumber} WHERE id=?`,{
                        replacements:[decoded.id],
                        type:QueryTypes.SELECT
                    })
                    if (!userData) {
                        res.status(404).json({
                            message: "No user with that token"
                        })
                        return
                    }
                    req.user = {...userData,currentInstituteNumber:decoded.instituteNumber}
                    next()
                } catch (error) {
                    res.status(500).json({
                        message: "something went wrong"
                    })
                }
            }
        });
    }

    changeUserIdForTableName(req: IExtendedRequest, res: Response, next: NextFunction) {
        console.log(req.user, "Req user outside");

        if (req.user && req.user.id) {
            const newUserId = req.user.id.split("-").join("_");
            req.user = { id: newUserId, role: req.user.role };
            console.log(req.user, "RequserId");
        }
        
        next();
    }

    restrictTo(...roles: Role[]) {
        return (req: IExtendedRequest, res: Response, next: NextFunction) => {
            let userRole = req.user?.role as Role
            if (!roles.includes(userRole)) {
                res.status(403).json({
                    message: "you don't have permission"
                })
            } else {
                next()
            }

        }

    }
}

export default new AuthMiddleware()