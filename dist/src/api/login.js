"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const users_json_1 = __importDefault(require("../users.json"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let config = {
    secret: 'aab41acc-c23f-418d-b808-9f02cfd5b106'
};
let middleware = (req, res, next) => {
    let token = req.headers['cookie'].split(' ')[1]; // Express headers are auto converted to lowercase
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    if (token && token.startsWith('token=')) {
        token = token.slice(6, token.length);
    }
    if (token) {
        jsonwebtoken_1.default.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            }
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};
exports.middleware = middleware;
class HandlerGenerator {
    login(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        if (username && password) {
            for (let user of users_json_1.default) {
                if (username === user.username && password === user.password) {
                    let token = jsonwebtoken_1.default.sign({ username: username }, config.secret, { expiresIn: '24h' });
                    res.cookie('token', token)
                        .redirect(`/users`);
                }
                else {
                    console.log('not correct pass or user');
                }
            }
        }
        else {
            res.send(400).json({
                success: false,
                message: 'Authentication failed! Please check the request'
            });
        }
    }
}
exports.default = HandlerGenerator;
//# sourceMappingURL=login.js.map