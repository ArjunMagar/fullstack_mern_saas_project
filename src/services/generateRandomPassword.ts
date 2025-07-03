import bcrypt from 'bcrypt'

const generateRandomPassword = (teacherName: string) => {
    const randomNumber = Math.floor(1000) + Math.random() * 9000
    const passwordData = {
        hashedVersion: bcrypt.hashSync(`${randomNumber}_${teacherName}`, 10), // table ma store garna ko lagi
        plainVersion: `${randomNumber}_${teacherName}`  // teacher lai mail ma sent garna ko lagi
    }
    return passwordData

}

export default generateRandomPassword