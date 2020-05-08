const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation }= require('../validation');

router.post('/register', async (req, res) => {
    //Lets validate the data
    const { error } = registerValidation(req.body); //const validation = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    //Cheking if the user already exists
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.status(400).send('Email already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try{
        const savedUser = await user.save();
        res.send(savedUser);
    } catch(err) {
        res.status(400).send(err)
    }
});

//Login
router.post('/login', async (req, res) => {
    //Lets validate the data
    const { error } = loginValidation(req.body); //const validation = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    //Cheking if the email already exists
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Email is not found');
    //Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //Create and assign a toke 
    const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token);

})

module.exports = router;
