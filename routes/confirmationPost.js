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
                    res.error({msg:err.message});
                }
            });
            res.send("verified");
        });
        
    });
});

module.exports = router;