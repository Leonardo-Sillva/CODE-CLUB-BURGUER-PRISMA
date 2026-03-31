import express from 'express';
import routes from './routes.js';

class App {
    constructor() {
        this.app = express()
        this.middlewares()

        this.Routes()
    }

    middlewares() {
        this.app.use(express.json())
    }

    Routes() {
        this.app.use(routes)
    }
}

export default new App().app