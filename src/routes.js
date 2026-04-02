import { Router } from "express";
import multer from "multer";
import multerconfig from "./config/multer.js"
import UserController from "./controller/UserController.js";
import SessionController from "./controller/SessionController.js";
import ProductController from "./controller/ProductController.js";

const routes = new Router

const upload = multer(multerconfig)

routes.post('/users', UserController.store)

routes.post('/session', SessionController.store)

routes.post('/products', upload.single('file'), ProductController.store)

export default routes