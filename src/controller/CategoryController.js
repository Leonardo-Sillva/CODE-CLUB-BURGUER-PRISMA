import * as Yup from 'yup'
import { prisma } from '../lib/prisma.ts'

class CategoryController{
    async store(req, resp){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
        })

        try{
            await schema.validateSync(req.body, { abortEarly: false })
       } catch(err) {
        return resp.status(400).json({ error: err.errors })
       }

        const {name} = req.body

        const categoryExists = await prisma.categories.findUnique({
            where:{name} 
        })

        if(categoryExists){
            return resp.status(400).json({error: "category already exists!"})
        }

        const {id} = await prisma.categories.create({
            data: {name}
        })


       return resp.json({ name, id })
    }

    async index(req, resp){
        const category = await prisma.categories.findMany()

        console.log(`Aquiiiiiiiiiiiiiiiiiiiiiiii ${category}`)
        return resp.json(category)
    }
}

export default new CategoryController()