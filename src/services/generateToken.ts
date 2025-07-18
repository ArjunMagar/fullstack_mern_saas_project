import jwt from 'jsonwebtoken'
import { envConfig } from '../config/config'

const generateToken = (data: {
    id: string,
    name:string,
    role:string,
    instituteNumber?: string
}) => {
    // token generate (jwt)
    const token = jwt.sign(data, envConfig.jwtSecretKey, {
        expiresIn: envConfig.jwtExpiresIn
    })
    return token
}

export default generateToken