import * as Yup from 'yup'
import {prisma} from '../lib/prisma.ts'
import jwt from 'jsonwebtoken'
import authConfig from '../config/auth.js'
import bcrypt from 'bcrypt'

class SessionController{
    async store(req, resp) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        })

        if(!(await schema.isValid(req.body))){
            return resp.status(400).json({error: "make sure your password or email are correct"})
        }

        const {email, password} = req.body

        const user = await prisma.users.findUnique({
            where: {email}
        })

        console.log(req.body.password)
        console.log(user)
        console.log(user.password_hash)

        if(!user){
            return resp.status(400).json({error: "make sure your password or email are correct"})
        }

        const passwordValid = await bcrypt.compare(password, user.password_hash)

        if(!passwordValid){
            return resp.status(400).json({error: "make sure your password or email are correct"})
        }

        return resp.json({
            id: user.id,
            email,
            name: user.name,
            admin: user.admin,
            token: jwt.sign({id: user.id, name: user.name}, authConfig.secret, {
                expiresIn: authConfig.expiresIn
            })
        })
    }
}

export default new SessionController()