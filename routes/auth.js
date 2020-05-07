const router = require('express').Router();
const User = require('../model/User');
const { registerValidation }= require('../validation');

router.post('/register', async (req, res) => {
    //Lets validate the data
    const { error } = registerValidation(req.body); //const validation = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    //Cheking if the use already exists
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.status(400).send('Email already exists');

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try{
        const savedUser = await user.save();
        res.send(savedUser);
    } catch(err) {
        res.status(400).send(err)
    }
});

module.exports = router;
