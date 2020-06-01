const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();

//Import Routes
const authRoute = require('./routes/auth');

dotenv.config();

const uri = 'mongodb://localhost/jwt';

//Connect to DB
mongoose.connect(
    uri, 
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
);
mongoose.connection.once('open', function(){
    console.log('connected to db!');
})

//Middleware
app.use(express.json());

//Route Middleware
app.use('/api/user', authRoute);

app.listen(5000, () => console.log('Server up and running'));