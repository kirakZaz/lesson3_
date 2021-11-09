import users from '../../users.json'
import jwt from'jsonwebtoken';
import fs from 'fs'
import path from "path";

let config =  {
    secret: 'aab41acc-c23f-418d-b808-9f02cfd5b106'
}

let middleware = (req, res, next) => {
    let token = req.headers['cookie'].split(' ')[1] // Express headers are auto converted to lowercase
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    if (token && token.startsWith('token=')) {
        token = token.slice(6, token.length);
    }

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};

class HandlerGenerator {
    login (req, res) {
        let username = req.body.username;
        let password = req.body.password;

        if (username && password) {
            for (let user of users) {
                if (username === user.username && password === user.password) {
                    let token = jwt.sign(
                        {username: username},
                        config.secret,
                        { expiresIn: '24h' }
                    );

                    let s4 = () => {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }

                    let userToken = {
                        id: s4(),
                        username: user.username,
                        token
                    }

                    let data = fs.readFileSync(path.join(__dirname, "../../tokens.json"));

                    let dataNoBuff = data.toString()
                    let tokens = JSON.parse(dataNoBuff);

                    tokens.push(userToken);
                    console.log('tokens', tokens)

                    dataNoBuff = JSON.stringify(tokens);
                    fs.writeFileSync("./tokens.json", dataNoBuff);

                    res.cookie('token', token)
                    res.redirect(`/users`)


                } else {
                    console.log('not correct pass or user')
                }
            }
        } else {
            res.send(400).json({
                success: false,
                message: 'Authentication failed! Please check the request'
            });
        }
    }
}

export { middleware }
export default HandlerGenerator