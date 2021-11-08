import express from 'express';
import bodyParser from 'body-parser';
import path from "path";
import morgan from "morgan";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc'

import swaggerDocument from '../swagger.json';
import { createProxyMiddleware } from 'http-proxy-middleware';

import userRoutes from "./api/user";
import HandlerGenerator from './api/login'
import { middleware } from './api/login'


// Starting point of the server
function main () {
    let app = express();

    let handlers = new HandlerGenerator();

    const port = process.env.PORT || 5000;

    const swaggerDefinition = {
        openapi: '2.0.0',
        swagger: "2.0",
        info: {
            title: 'Express API for JSONPlaceholder',
            version: '1.0.0',
            description:
                'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
            license: {
                name: 'Licensed Under MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'Kira Za'
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
    };

    const options = {
        swaggerDefinition,
        apis: ['./api/*.ts'],
    };

    const swaggerSpec = swaggerJSDoc(options);

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(morgan('dev'));
    app.use('/u', createProxyMiddleware({
        target: 'u',
        changeOrigin: true,
        pathRewrite: {
            [`^/u`]: '',
        },
    }));
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/', userRoutes)


    // Routes & Handlers

    app.post('/', handlers.login);
    app.get("/", function (request, response) {
        response.sendFile(__dirname + "/public/login.html");
    });
    userRoutes.get('/users', middleware, (request, response) => {
        response.sendFile('users.html', { root: path.join(__dirname, '../public') })
    });

    app.listen(5000, 'localhost', () => {
        console.log(`Starting Proxy at localhost:${port}`);
    });
}

main();