"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jsonParser = express_1.default.json();
const userRoutes = express_1.default.Router({ mergeParams: true });
/**
 * @swagger
 * /Users:
 *   get:
 *     description: Get all User
 *     responses:
 *       200:
 *         description: Success
 *
 */
userRoutes.get("/api/users", (req, res) => {
    const content = fs_1.default.readFileSync(path_1.default.join(__dirname, "../users.json"));
    const users = JSON.parse(content.toString());
    res.send(users);
});
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns a single user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single user
 *         schema:
 *           $ref: '#/definitions/User'
 */
userRoutes.get("/api/users/:id", (req, res) => {
    const id = req.params.id; // получаем id
    const content = fs_1.default.readFileSync(path_1.default.join(__dirname, "../users.json"));
    const users = JSON.parse(content.toString());
    let user = null;
    // находим в массиве пользователя по id
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            user = users[i];
            break;
        }
    }
    // отправляем пользователя
    if (user) {
        res.send(user);
    }
    else {
        res.status(404).send();
    }
});
/**
 * @swagger
 * /Users:
 *   post:
 *     description: Create an User
 *     parameters:
 *     - name: UserName
 *       description: Create an new user
 *       in: formData
 *       required: true
 *       type: String
 *     responses:
 *       201:
 *         description: Created
 *
 */
userRoutes.post("/api/users", jsonParser, (req, res) => {
    if (!req.body)
        return res.sendStatus(400);
    const userName = req.body.username;
    const userEmail = req.body.email;
    const userRole = req.body.role;
    const userId = req.body.id;
    let user = { id: userId, username: userName, email: userEmail, role: userRole };
    let data = fs_1.default.readFileSync(path_1.default.join(__dirname, "../users.json"));
    let dataNoBuff = data.toString();
    let users = JSON.parse(dataNoBuff);
    // добавляем пользователя в массив
    users.push(user);
    dataNoBuff = JSON.stringify(users);
    // перезаписываем файл с новыми данными
    fs_1.default.writeFileSync('../users.json', dataNoBuff);
    res.send(user);
});
/**
 * @swagger
 * /Users:
 *   put:
 *     description: Create an User
 *     parameters:
 *     - name: UserName
 *       description: Create an new user
 *       in: formData
 *       required: true
 *       type: String
 *     responses:
 *       201:
 *         description: updated
 *
 */
userRoutes.put("/api/users", jsonParser, (req, res) => {
    if (!req.body)
        return res.sendStatus(400);
    const userName = req.body.username;
    const userEmail = req.body.email;
    const userRole = req.body.role;
    const userId = req.body.id;
    const dataBuff = fs_1.default.readFileSync(path_1.default.join(__dirname, "../users.json"));
    let data = dataBuff.toString();
    const users = JSON.parse(data);
    let user;
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == userId) {
            user = users[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if (user) {
        user.email = userEmail;
        user.username = userName;
        user.role = userRole;
        data = JSON.stringify(users);
        fs_1.default.writeFileSync("../users.json", data);
        res.send(user);
    }
    else {
        res.status(404).send(user);
    }
});
/**
 * @swagger
 * /Users:
 *   delete:
 *     description: Create an Users
 *     parameters:
 *     - name: UserName
 *       description: Create an new user
 *       in: formData
 *       required: true
 *       type: String
 *     responses:
 *       201:
 *         description: deleted
 *
 */
userRoutes.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    // let data = fs.readFileSync('users.json', "utf8");
    const dataBuff = fs_1.default.readFileSync(path_1.default.join(__dirname, "../users.json"));
    let data = dataBuff.toString();
    let users = JSON.parse(data.toString());
    let index = -1;
    // находим индекс пользователя в массиве
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        // удаляем пользователя из массива по индексу
        const user = users.splice(index, 1)[0];
        data = JSON.stringify(users);
        fs_1.default.writeFileSync("../users.json", data);
        // отправляем удаленного пользователя
        res.send(user);
    }
    else {
        res.status(404).send();
    }
});
/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: '#/definitions/User'
 */
userRoutes.get("/users", (request, response) => {
    response.sendFile('users.html', { root: path_1.default.join(__dirname, '../public') });
});
exports.default = userRoutes;
//# sourceMappingURL=user.js.map