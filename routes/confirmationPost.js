const router = require('express').Router();
const User = require('../models/user');
const Token = require('../models/token');


router.get('/confirmation/:token',(req, res)=>{
    // Find a matching token
    Token.find({token: req.params.token}).then((tokens) =>{
        if (!tokens[0]) return res.send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
        
        User.findOne({ _id: tokens[0]._userId}).then((users)=>{
            if (!users) return res.send("nothing");
            if (users.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
            users.isVerified = true;
            users.save(function (err) {
                if(err) {
                    console.error('ERROR!');
                }
            });
            res.send("verified");
        });
        
    });
     /*await Token.findOne({ token: JSON.stringify(req.params.token) }, async (err, token) => {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
 
        // If we found a token, find a matching user
        await User.findOne({ _id: req.params._userId, email: req.params.email }, function (err, user) {
            if (!user) return res.status(400).send({ msg: req.params.email });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });*/
});

module.exports = router;