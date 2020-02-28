const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();


//body parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const authRoute = require('./routes/auth');
const confRoute = require('./routes/confirmationPost');



mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));



app.use('/',authRoute);
app.use('/',confRoute);


app.listen(3000);