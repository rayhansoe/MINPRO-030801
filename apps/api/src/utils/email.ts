import { sign } from "jsonwebtoken"

import path from "path"
import fs from "fs"
import { transporter } from "../helpers/nodemailers"
import Handlebars from "handlebars";

type ISendEmailVerifyProps = {id: number, isActive: boolean, displayName: string, email: string}
type ISendEmailVerify = (props: ISendEmailVerifyProps) => Promise<void>

export const sendEmailVerification: ISendEmailVerify = async ({id, isActive, displayName, email}) => {
  const payload = {
    id,
    isActive
  }
  const token = sign(payload, "privateKey", { expiresIn: '1h' })
  const link = `http://localhost:8000/api/users/verify/${token}`

  const templatePath = path.join(__dirname, "../templates", "register.html")
  const templateSource = fs.readFileSync(templatePath, 'utf-8')
  const compiledTemplate = Handlebars.compile(templateSource)
  const html = compiledTemplate({
    name: displayName,
    link
  })

  await transporter.sendMail({
    from: "designwithme21@gmail.com",
    to: email,
    subject: "Welcome to kitabuatevent",
    html
  })
}

export const sendResetPassword: ISendEmailVerify = async ({id, isActive, displayName, email}) => {
  const payload = {
    id,
    reset: true,
  }
  const token = sign(payload, "privateKey", { expiresIn: '1h' })
  const link = `http://localhost:8000/api/users/reset/${token}`

  console.log(link);
  

  const templatePath = path.join(__dirname, "../templates", "reset.html")
  const templateSource = fs.readFileSync(templatePath, 'utf-8')
  const compiledTemplate = Handlebars.compile(templateSource)
  const html = compiledTemplate({
    name: displayName,
    link
  })

  await transporter.sendMail({
    from: "designwithme21@gmail.com",
    to: email,
    subject: "Reset Password",
    html
  })
}