import { Request, Response } from "express";
import User from "../../database/models/userModel";
import bcrypt from "bcrypt"
import { envConfig } from "../../config/config";
import generateToken from "../../services/generateToken";

class UserController {

    static async register(req: Request, res: Response) {
        const { username, email, password } = req.body
        // Validate input
        if (!username || !email || !password) {
            res.status(400).json({
                message: "Please provide username,email, and password."
            })
            return

        }
        //check whether that email already exist or not
        const existingUser = await User.findOne({
            where: {
                email
            }
        })
        if (existingUser) {
            res.status(409).json({
                message: "Email already in use."
            })
            return
        }
        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        // Create new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            message: "User registered successfully",

        })
    }

    static async login(req:Request,res:Response){
        const {email,password} = req.body
         // Validate input
        if(!email ||!password){
            res.status(400).json({
                message: "Please provide email,password"
            })
            return
        }
        //check email exist or not at first
        const [user]= await User.findAll({    // findAll return array
            where: {
                email
            }
        })
        if(!user){
            res.status(404).json({
                message : "No user with that email"
            })
            
        }else {
            //if yes -->email exist --> check password too
            const isEqual = bcrypt.compareSync(password,user.password)
            if(!isEqual){
                res.status(400).json({
                    message : "Invalid password"
                })
            }else{
            //if password is matched --> token generate(jwt)
            const token = generateToken(user.id)
            res.status(200).json({
                message: "logged in success",
                token
            })
            }
        }

    }

}

export default UserController