"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const user_1 = __importDefault(require("./api/user"));
const login_1 = __importDefault(require("./api/login"));
const login_2 = require("./api/login");
// Starting point of the server
function main() {
    let app = (0, express_1.default)();
    let handlers = new login_1.default();
    const port = process.env.PORT || 5000;
    // const options = {
    //     swaggerDefinition: {
    //         swagger: "2.0",
    //         openapi: "2.0.0",
    //         info: {
    //             title: "HTTP Express API with Swagger",
    //             version: "0.1.0",
    //             description:
    //                 "This is a simple CRUD API application made with Express and documented with Swagger",
    //             license: {
    //                 name: "MIT",
    //                 url: "https://spdx.org/licenses/MIT.html",
    //             },
    //             contact: {
    //                 name: "Kira Za",
    //                 email: "kirka.zaz@email.com",
    //             },
    //         },
    //         servers: [
    //             {
    //                 url: 'http://localhost:3000',
    //                 description: 'Development server',
    //             },
    //         ]
    //     },
    //     apis: [`./api/users.ts`]
    // };
    //
    // const specs = swaggerJSDoc(options);
    // app.use(
    //     "/api/docs",
    //     swaggerUi.serve,
    //     swaggerUi.setup(specs, swaggerDocument)
    // );
    const swaggerDefinition = {
        openapi: '3.0.0',
        info: {
            title: 'Express API for JSONPlaceholder',
            version: '1.0.0',
            description: 'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
            license: {
                name: 'Licensed Under MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'JSONPlaceholder',
                url: 'https://jsonplaceholder.typicode.com',
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
        // Paths to files containing OpenAPI definitions
        apis: ['./api/*.ts'],
    };
    const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use((0, morgan_1.default)('dev'));
    app.use('/u', (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: 'u',
        changeOrigin: true,
        pathRewrite: {
            [`^/u`]: '',
        },
    }));
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use('/', user_1.default);
    // Routes & Handlers
    //
    // app.get('/api/docs', function(req, res) {
    //     res.setHeader('Content-Type', 'application/json');
    //     res.send(specs);
    // });
    app.post('/', handlers.login);
    app.get("/", function (request, response) {
        response.sendFile(__dirname + "/public/login.html");
    });
    user_1.default.get('/users', login_2.middleware, (request, response) => {
        response.sendFile('users.html', { root: path_1.default.join(__dirname, '../public') });
    });
    app.listen(5000, 'localhost', () => {
        console.log(`Starting Proxy at localhost:${port}`);
    });
}
main();
//# sourceMappingURL=app.js.map