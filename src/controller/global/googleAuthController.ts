import {Request,Response,NextFunction} from 'express'
import passport from 'passport'
import {envConfig} from '../../config/config'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../../database/models/userModel';
import generateToken from '../../services/generateToken';
 
class googleAuthController {
    // Initialize passport Google Strategy
    static initGoogleStrategy() {
      passport.use(new GoogleStrategy({
        clientID: envConfig.clientID,
        clientSecret: envConfig.clientSecret,
        callbackURL: envConfig.callbackURL,
        passReqToCallback: true, // Gives us access to req in the callback
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          // Step 1: Look for user in DB
          let user = await User.findOne({
            where: {
              email: profile.emails?.[0]?.value
            }
          });
  
          // Step 2: If not found, create a new user
          if (!user) {
            user = await User.create({
              email: profile.emails?.[0]?.value,
              username: profile.displayName   
      
    
            });
          }
  
          // Step 3: Create JWT token for logged-in user
          const token = generateToken({id:user.id})
        
  
          // Step 4: Pass user and token to the next handler
          // console.log(profile)
          return done(null,{token,user});
        } catch (err) {
          return done(err);
        }
      }));
    }
  
    // Route to start Google login
    static login(req:Request, res:Response, next:NextFunction) {
      passport.authenticate('google', {
        scope: ['email', 'profile'] // Ask Google for user's email and profile info
      })(req, res, next);
    }
  
    // Callback route Google redirects to after login
    static callback(req:Request, res:Response){
      passport.authenticate('google', { session: false }, (err, result) => {
        if (err || !result) {
          return res.redirect('/auth/google/failure'); // Error case
        }
  
        const {token,user} = result;
        
    // Option A: Return JSON
       return res.status(200).json({
            message: "Google login successful",
            data : {user:{
              userid:user.id,
              username:user.username,
              email:user.email,
              role:user.role
            },
            token}
    // Option B: Redirect and pass token to frontend via param
    // return res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
          
        });
      })(req,res);
    }

  }
  
  export default googleAuthController;