import { Request, Response } from "express";
import User from "../../database/models/userModel";
import bcrypt from "bcrypt";
import generateToken from "../../services/generateToken";

class AuthController {
  static async register(req: Request, res: Response) {
    if (req.body == undefined) {
      res.status(400).json({
        message: "No data was sent !!",
      });
      return;
    }
    const { username, email, password } = req.body;
    // Validate input
    if (!username || !email || !password) {
      res.status(400).json({
        message: "Please provide username,email, and password.",
      });
      return;
    }
    //check whether that email already exist or not
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });
    if (existingUser) {
      res.status(409).json({
        message: "Email already in use.",
      });
      return;
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  }

  static async login(req: Request, res: Response) {
    try {
      if (req.body == undefined) {
        res.status(400).json({
          message: "No data was sent !!",
        });
        return;
      }
      const { email, password } = req.body;
      // Validate input
      if (!email || !password) {
        res.status(400).json({
          message: "Please provide email,password",
        });
        return;
      }
      //check email exist or not at first
      const [user] = await User.findAll({
        // findAll return array
        where: {
          email,
        },
      });
      if (!user) {
        res.status(404).json({
          message: "No user with that email",
        });
      } else {
        //if yes -->email exist --> check password too
        const isEqual = bcrypt.compareSync(password, user.password);
        if (!isEqual) {
          res.status(400).json({
            message: "Invalid password",
          });
        } else {
          //if password is matched --> token generate(jwt)
          const token = generateToken({ id: user.id, name: user.username, role: user.role });
          res.status(200).json({
            message: "logged in success",
            token,
            data:{ id: user.id, name: user.username, role: user.role }

          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}

export default AuthController;
