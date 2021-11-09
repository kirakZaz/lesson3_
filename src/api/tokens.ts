import express from "express";
import fs from 'fs'

import path from "path";
import userRoutes from "./user";

const tokenRoutes = express.Router({ mergeParams: true })


/**
 * @swagger
 * /Tokens:
 * /api/tokens:
 *   get:
 *     summary: Returns all tokens
 *     tags: [Tokens]
 *     responses:
 *       200:
 *         description: the list of the tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

tokenRoutes.get("/api/tokens", (req, res) => {
    console.log('__dirname',__dirname)
    const content = fs.readFileSync(path.join(__dirname, "../../tokens.json"));
    const users = JSON.parse(content.toString());
    res.send(users);
});

userRoutes.get("/tokens", (request, response) => {
    response.sendFile('tokens.html', { root: path.join(__dirname, '../public') })
});

export default tokenRoutes