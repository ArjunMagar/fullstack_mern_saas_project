import nodemailer from 'nodemailer'

interface IMailInformation {
    to: string,
    subject: string,
    text: string
}

const sendMail = async (mailInformation: IMailInformation) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_GMAIL,
            pass: process.env.NODEMAILER_GMAIL_APP_PASSWORD
        }
    })

    const mailFormatObject = {
        from: "sass mern <arjunmagar6820@gmail.com>",
        to: mailInformation.to,
        subject: mailInformation.subject,
        text: mailInformation.text
    }

    try {
        await transporter.sendMail(mailFormatObject)
        console.log("Email sent successfully!")
    } catch (error) {
        console.log("Failed to send email:", error)
    }

}

export default sendMail