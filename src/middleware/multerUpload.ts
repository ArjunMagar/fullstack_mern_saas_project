import {Request}from 'express'
import multer from 'multer'
import { cloudinary, storage } from '../services/cloudinaryConfig'
//callback function - cb(error,success), cb(error)
const upload = multer({
    storage: storage,
    fileFilter: (req: Request, file: Express.Multer.File, cb) => {
        const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg']
        if (allowedFileTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("only image support garxa hai!!!"))
        }
    },
    limits: {
        fileSize: 2 * 1024 * 1024  //2mb
    }
})


export default upload