import express from 'express';
import bodyParser from 'body-parser';
import path from "path";
import morgan from "morgan";
import swaggerUi from 'swagger-ui-express';
import * as sequelize from 'sequelize'

import swaggerDocument from '../swagger.json';
import { createProxyMiddleware } from 'http-proxy-middleware';

import userRoutes from "./api/user";
import tokenRoutes from "./api/tokens";
import HandlerGenerator from './api/login'


// Starting point of the server
function main () {
    let app = express();

    let handlers = new HandlerGenerator();

    const port = process.env.PORT || 5000;


    const dbConfig = new sequelize.Sequelize('robo-node', 'user1', 'sa', {
        host: 'localhost',
        dialect: 'mysql'
    });
    const connect = async () => {
        try {
            await dbConfig.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
    connect()
        .then(r => console.log('db connected ', r))
        .catch((err) => console.log('error db connection', err))
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }))

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
    app.use('/', tokenRoutes)


    // Routes & Handlers

    app.post('/login', handlers.login);
    app.get("/", function (request, response) {
        response.sendFile(__dirname + "/public/login.html");
    });

    app.listen(5000, 'localhost', () => {
        console.log(`Starting Proxy at localhost:${port}`);
    });
}

main();