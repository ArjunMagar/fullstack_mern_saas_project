import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/config";
import User from "../database/models/userModel";

export interface AuthRequest extends Request {
    user?: {
        id?: string,
        username?: string,
        email?: string,
        role?: string,
        password?: string,
        currentInstituteNumber?:string


    }
}
export enum Role {
    Super_Admin = 'superAdmin',
    Institute = 'institute',
    Teacher = 'teacher',
    Student = 'student'
}

class AuthMiddleware {

    async isAuthenticated(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
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
                //check if that decoded object id user exist or not
                try {
                    const userData = await User.findByPk(decoded.userId);
                    if (!userData) {
                        res.status(404).json({
                            message: "No user with that token"
                        })
                        return
                    }
                    req.user = userData
                    next()
                } catch (error) {
                    res.status(500).json({
                        message: "something went wrong"
                    })
                }
            }
        });
    }

    restrictTo(...roles: Role[]) {
        return (req: AuthRequest, res: Response, next: NextFunction) => {
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