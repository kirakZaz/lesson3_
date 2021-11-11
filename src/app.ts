import express from 'express';
import bodyParser from 'body-parser';
import path from "path";
import morgan from "morgan";
import swaggerUi from 'swagger-ui-express';
import { Sequelize, DataTypes } from 'sequelize';

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
    app.set('view engine', 'html')

    const sequelize = new Sequelize('postgres://postgres:robopass@localhost:5432/postgres')

    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });

//     const User = sequelize.define('user', {
//         // attributes
//         firstName: {
//             type: Sequelize.STRING,
//             allowNull: false
//         },
//         lastName: {
//             type: Sequelize.STRING
//             // allowNull defaults to true
//         }
//     }, {
// // options
//     });

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