import { Request } from "express"


export interface IExtendedRequest extends Request {
    user?: {
        id?: string,
        username?: string,
        email?: string,
        role?: string,
        currentInstituteNumber?:string
    }
}

export enum Role {
    Super_Admin = 'superAdmin',
    Institute = 'institute',
    Teacher = 'teacher',
    Student = 'student',
    Visitor = 'visitor'
}