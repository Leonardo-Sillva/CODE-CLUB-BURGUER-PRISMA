import * as Yup from 'yup'
import { prisma } from '../lib/prisma.ts'

class ProductController{
    async store(req, resp){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            price: Yup.number().required(),
            categoryId: Yup.number().required(),

        })

        try{
            await schema.validateSync(req.body, { abortEarly: false })
       } catch(err) {
        return resp.status(400).json({ error: err.errors })
       }

        console.log(req)
        const {filename: path} = req.file
        const {name, price, categoryId} = req.body

        const product = await prisma.products.create({
            data: { name,
                price,
                categoryId: Number(categoryId),
                path,
            }
        })


       return resp.json(product)
    }

    async index(req, resp){
        const product = await prisma.products.findMany({
            include: { category: {
                       select: {
                                id: true,
                                name: true
                               }
                            } 
                    }
        })

        const formatted = product.map(product => ({
            ...product,
            url: `http://localhost:3000/product-file/${product.path}`
        }))

        console.log(req)
        return resp.json(formatted)
    }
}

export default new ProductController()