import { prisma } from "../lib/prisma.ts"
import * as Yup from 'yup'
import Order from '../schema/Order.js'

class OrderController {
    async store(req, resp) {

        const schema = Yup.object().shape({
            products: Yup.array().required().of(
                Yup.object().shape({
                    id: Yup.number().required(),
                    quantity: Yup.number().required(),
                })
            )

        })

        console.log(req)
        try {
            await schema.validateSync(req.body, { abortEarly: false })
        } catch (err) {
            return resp.status(400).json()
        }


        const productsId = req.body.products.map(product => Number(product.id))

        console.log(req.body.products)
        console.log(productsId)
        const updateProducts = await prisma.products.findMany({
            where: {
                id: {
                    in: productsId,
                },
            },
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        })



        const editedProduct = updateProducts.map(product => {
            const productIndex = req.body.products.findIndex((requestProduct) => requestProduct.id === product.id)



            const newProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category.name,
                url: `http://localhost:3000/product-file/${product.path}`,
                quantity: req.body.products[productIndex].quantity,
            }

            return newProduct
        })

        const order = {
            user: {
                id: req.userId,
                name: req.userName,
            },
            products: editedProduct,
            status: 'Pedido realizado'
        }

        const orderResponse = await Order.create(order)

        return resp.status(201).send(orderResponse)
    }

    async index(req, resp){
        const orders = await Order.find()

        return resp.json(orders)
    }

    async update(req, resp){
        const schema = Yup.object().shape({
            status: Yup.string().required(),
        })

        console.log(req)
        try {
            await schema.validateSync(req.body, { abortEarly: false })
        } catch (err) {
            return resp.status(400).json({ error: err.errors })
        }

        const {admin: isAdmin } = await prisma.users.findUnique({
            where: {
                id: req.userId
            }
        })

        if (!isAdmin) {
            return resp.status(401).json()
        }




        const {id} = req.params
        const {status} = req.body

        try{
            await Order.updateOne({_id: id }, { status })
        }catch(error){
            return resp.status(400).json({error: error.message})
        }
        

        return resp.json('status was updated')
    }
}
export default new OrderController()