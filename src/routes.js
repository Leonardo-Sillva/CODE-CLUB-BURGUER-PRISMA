import { Router } from "express";
import multer from "multer";
import multerconfig from "./config/multer.js"
import UserController from "./controller/UserController.js";
import SessionController from "./controller/SessionController.js";
import ProductController from "./controller/ProductController.js";
import CategoryController from "./controller/categoryController.js";
import authMiddleware from "./middlewares/auth.js"
import OrderController from "./controller/OrderController.js";

const routes = new Router

const upload = multer(multerconfig)

routes.post('/users', UserController.store)

routes.post('/session', SessionController.store)

routes.use(authMiddleware)
/* esse middleware só funciona nas rotas que estao abaixo do use */

routes.post('/products', upload.single('file'), ProductController.store)
routes.get('/products', ProductController.index)

routes.post('/categories', CategoryController.store)
routes.get('/categories', CategoryController.index)

routes.post('/orders', OrderController.store)


export default routes