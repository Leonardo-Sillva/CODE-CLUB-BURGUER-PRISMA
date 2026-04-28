import express from 'express';
import routes from './routes.js';
import { resolve } from 'node:path';
import { fileURLToPath } from 'url';

import './database/database.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');


class App {
    constructor() {
        this.app = express()
        this.middlewares()

        this.Routes()
    }

    middlewares() {
        this.app.use(express.json())
        this.app.use('/product-file', express.static(resolve(__dirname, '..', 'uploads')))
    }

    Routes() {
        this.app.use(routes)
    }
}

export default new App().app