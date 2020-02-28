const router = require('express').Router();
const User = require('../models/user');
const Token = require('../models/token');
const {registerValidate, loginValidate} = require('../validation');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/register',async (req, res)=>{
    const {error} = registerValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try{
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('Email already exists');
    } catch(err){
        console.log("error");
    }
    //Create New User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password,salt);
        user.password = hashPassword;

        user.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
     
            // Create a verification token for this user
            var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
     
            // Save the verification token
            token.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
     
                // Send the email
                //put email and password in the .env file
                var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: "", pass: "" } });//add emails, and passwords from keys or env
                var mailOptions = { from: "", to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
                transporter.sendMail(mailOptions, function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    res.status(200).send('A verification email has been sent to ' + user.email + '.');
                });
            });
        });
    }catch(err) {
        res.status(400).send(err);
    }

});



router.post('/login', async (req, res) => {
    const {error} = loginValidate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({email:req.body.email});

    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass || !user) return res.status(400).send('Invalid Email or Password');

    res.send("logged In");


});



module.exports = router;