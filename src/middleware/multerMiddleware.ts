//multer configuration
import { Request } from 'express'
import multer from 'multer'

//locally file store garnu vayo
const storage = multer.diskStorage({
    //location incoming file kata rakne vanne ho
    // cb - callback function
    // cb(error,success)
    destination: function (req: Request, file: Express.Multer.File, cb: any) {
        cb(null, './src/storage')
    },
    //mathi ko location deko ma rakey paxi, k name ma rakne vannne
    filename: function (req: Request, file: Express.Multer.File, cb: any) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

export { multer, storage }



