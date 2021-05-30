const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { registerValidation, loginValidation } = require('./validation');
dotenv.config();


router.post('/register', async (req, res) => {
    //validates that req.body has the right conditions(ex- pw length etc)
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checks if user is already exists in the database
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) res.status(400).send('Email already exists!');

    else {
        //encrypts password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //creates a new user 
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        try {
            const savedUser = await user.save();
            res.send({ user: user._id });
        } catch (err) {
            res.status(400).send(err);
        }
    }
});

router.post('/login', async (req, res) => {
    //validates un & pw conditions
    const { error } = loginValidation(req.body);
    if (error) res.status(400).send(error.details[0].message);

    //checks if the email exists in the database
    const user = await User.findOne({ email: req.body.email });
    if (!user) res.status(400).send('Wrong email or password!');

    //checks if the password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) res.status(400).send('Wrong email or password!');


    //create and assign jwt
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});


module.exports = router;