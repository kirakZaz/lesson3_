import express from "express";
import fs from 'fs'

import path from "path";
const jsonParser = express.json();

const userRoutes = express.Router({ mergeParams: true })

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API to manage your users.
 * components:
 *    schemas:
 *        Book:
 *            type: object
 * required:
 *    - username
 *    - email
 *    - token
 * properties:
 *   id:
 *   type: integer
 * description: The auto-generated id of the user.
 *   username:
 *   type: string
 * description: The name of your user.
 *   email:
 * type: string
 * description: The email of your user.
 *   token:
 *   type: boolean
 * description: The token of your user.
 *    example:
 * title: The Pragmatic Programmer
 * author: Andy Hunt / Dave Thomas
 * finished: true
 */

/**
 * @swagger
 * /Users:
 *   get:
 *     summary: Returns all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: the list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

userRoutes.get("/api/users", (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, "../users.json"));
    const users = JSON.parse(content.toString());
    res.send(users);
});

/**
 * @swagger
 * /Users:
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
 *               type: array
 */
userRoutes.get("/api/users/:id", (req, res) => {
    const id = req.params.id; // получаем id
    const content = fs.readFileSync(path.join(__dirname, "../users.json"));
    const users = JSON.parse(content.toString());
    let user = null;

    for(let i=0; i<users.length; i++){
        if(users[i].id==id){
            user = users[i];
            break;
        }
    }

    if (user){
        res.send(user);
    } else{
        res.status(404).send();
    }
});

/**
 * @swagger
 * /Users:
 *   post:
 *      summary: Create user
 *      description: Create an User
*       parameters:
 *      - name: UserName
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
    if(!req.body) return res.sendStatus(400);

    const userName = req.body.username;
    const userEmail = req.body.email;
    const userRole = req.body.role;
    const userId = req.body.id;

    let user = {id: userId, username: userName, email: userEmail, role: userRole};

    let data = fs.readFileSync(path.join(__dirname, "../users.json"));
    let dataNoBuff = data.toString()
    let users = JSON.parse(dataNoBuff);

    // добавляем пользователя в массив
    users.push(user);
    dataNoBuff = JSON.stringify(users);

    // перезаписываем файл с новыми данными
    fs.writeFileSync('../users.json', dataNoBuff);
    res.send(user);
});

/**
 * @swagger
 * /Users:
 *   put:
 *     summary: Returns all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: the list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
userRoutes.put("/api/users", jsonParser, (req, res) => {
    if(!req.body) return res.sendStatus(400);

    const userName = req.body.username;
    const userEmail = req.body.email;
    const userRole = req.body.role;
    const userId = req.body.id;

    const dataBuff = fs.readFileSync(path.join(__dirname, "../users.json"));
    let data = dataBuff.toString()

    const users = JSON.parse(data);
    let user;
    for(let i=0; i<users.length; i++){
        if(users[i].id==userId){
            user = users[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if(user){
        user.email = userEmail;
        user.username = userName;
        user.role = userRole;

        data = JSON.stringify(users);
        fs.writeFileSync("../users.json", data);
        res.send(user);
    }
    else{
        res.status(404).send(user);
    }
});

/**
 * @swagger
 * /Users:
 *  /api/users/{id}:
 *   delete:
 *   summary: Delete user
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
    const dataBuff = fs.readFileSync(path.join(__dirname, "../users.json"));
    let data = dataBuff.toString()
    let users = JSON.parse(data.toString());
    let index = -1;

    // находим индекс пользователя в массиве
    for (let i=0; i < users.length; i++) {
        if (users[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем пользователя из массива по индексу
        const user = users.splice(index, 1)[0];
        data = JSON.stringify(users);
        fs.writeFileSync("../users.json", data);
        // отправляем удаленного пользователя
        res.send(user);
    }
    else{
        res.status(404).send();
    }
});


userRoutes.get("/users", (request, response) => {
    response.sendFile('users.html', { root: path.join(__dirname, '../public') })
});

export default userRoutes

