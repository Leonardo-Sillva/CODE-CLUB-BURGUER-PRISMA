import { prisma } from "../lib/prisma.ts"
import * as Yup from 'yup'
import bcrypt from 'bcrypt'

class UserController {
    async store(req,resp) {

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            admin: Yup.boolean(),
        })

        try{
            await schema.validateSync(req.body, { abortEarly: false })
       } catch(err) {
        return resp.status(400).json({ error: err.errors })
       }

        const {name, email, password, admin} = req.body

        const userExistent = await prisma.users.findUnique({
            where: {email},
        })

        if(userExistent) {
            return resp.status(400).json({error: "Email já existente, tente outro."})
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await prisma.users.create({
            data: {
                name: name,
                email: email,
                password_hash: hash,
                admin: admin,
            }
        })
        
        return resp.status(201).send(user)
    }
}

export default new UserController()