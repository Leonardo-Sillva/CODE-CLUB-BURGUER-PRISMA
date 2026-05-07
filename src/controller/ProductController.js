import * as Yup from 'yup'
import { prisma } from '../lib/prisma.ts'
import { type } from 'node:os'

class ProductController {
    async store(req, resp) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            price: Yup.number().required(),
            categoryId: Yup.number().required(),
            offer: Yup.boolean(),

        })

        try {
            await schema.validateSync(req.body, { abortEarly: false })
        } catch (err) {
            return resp.status(400).json({ error: err.errors })
        }

        const { admin: isAdmin } = await prisma.users.findUnique({
            where: {
                id: req.userId
            }
        })

        if (!isAdmin) {
            return resp.status(401).json()
        }

        console.log(req)
        const { filename: path } = req.file
        const { name, price, categoryId, offer } = req.body

        const product = await prisma.products.create({
            data: {
                name,
                price,
                categoryId: Number(categoryId),
                path,
                offer,
            }
        })


        return resp.json(product)
    }

    async index(req, resp) {
        const product = await prisma.products.findMany({
            include: {
                category: {
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
    async update(req, resp) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            price: Yup.number(),
            categoryId: Yup.number(),
            offer: Yup.boolean(),

        })

        try {
            await schema.validateSync(req.body, { abortEarly: false })
        } catch (err) {
            return resp.status(400).json({ error: err.errors })
        }

        const { admin: isAdmin } = await prisma.users.findUnique({
            where: {
                id: req.userId
            }
        })

        //if (!isAdmin) {
            //return resp.status(401).json()
        //}

        let { id } = req.params  
        id = parseInt(id)
        
        
        
        
        
        
        
        //verifique o admin que estao pedindo e o id que esta indo como string no findUnique





        
        const product = await prisma.products.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        console.log(`PATEK  --- ${typeof(id)}`)

        if(!product){
            return resp.status(401).json({error: "make sure your product ID is correct"})
        }

        let path
        if(req.file){
            path = req.file.filename
        }

        
        const { name, price, categoryId, offer } = req.body

        await prisma.products.update({
            data: {
                name,
                price,
                categoryId: Number(categoryId),
                path,
                offer,
            },
            where: { id }
    })


        return resp.status(200).json(product)
    }
}

export default new ProductController()