import User from '../server/models/user';
require('dotenv').config()
const SECRET = process.env.SECRET
const jwt = require('jsonwebtoken')

const createToken = (username, id) => {
    return jwt.sign(
        {
            username,
            id
        },
        SECRET,
        {
            expiresIn: '2 days'
        }
    )
}

const submitHandler = (e) => {
    e.preventDefault();
    let body = { username, password };
    axios
    .post(register ? "/register" : "/login", body)
    .then((res) => {
        dispatch({ type: "LOGIN", payload: res.data });
    })
    .catch((err) => {
        console.error(err);
    });
    console.log("submitHandler called");
};

module.exports = {
    register: async (req, res) => {
        try {
        let {username, password} = req.body
        let foundUser = await User.findOne({where: {username:username}})
        if(foundUser) {
            res.status(400).send('Username is Taken!')
        } else {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
    
            let newUser = await User.create({username: username, hashedPass: hash})
    
            let token = createToken(newUser.dataValues.username, newUser.dataValues.id)
            const exp = Date.now() + 1000 * 60 * 60 * 48
    
            const data = {
            username: newUser.dataValues.username,
            userId: newUser.dataValues.id,
            token: token,
            exp: exp
            }
            res.status(200).send(data)
        }
        } catch (error) {
        console.error(error)
        res.status(400).send(error)
        }
    },
    login: async (req, res) => {
        try {
        let { username, password } = req.body;
        let foundUser = await User.findOne({ where: { username: username } });
        if (foundUser) {
            const isAuthenticated = bcrypt.compareSync(
            password,
            foundUser.hashedPass
            );
            if (isAuthenticated) {
            let token = createToken(
                foundUser.dataValues.username,
                foundUser.dataValues.id
            );
            const exp = Date.now() + 1000 * 60 * 60 * 48;
            const data = {
                username: foundUser.dataValues.username,
                userId: foundUser.dataValues.id,
                token: token,
                exp: exp,
            };
            res.status(200).send(data);
            } else {
            res.status(400).send("Password is incorrect");
            }
        } else {
            res.status(400).send("User does not exist.");
        }
        } catch (error) {
        console.error(error);
        res.status(400).send(error);
        }
    },
    // login: async (req, res) => {
    //     let {username, password} = req.body
    //     const token = createToken(username, password)
    //     res.status(200).send(token)
    // },
    // register: async (req, res) => {
    //     console.log('register')
    //     res.sendStatus(200)
    // },
}