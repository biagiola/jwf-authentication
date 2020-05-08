const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();

//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post'); 

dotenv.config();

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECT, 
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
);
mongoose.connection.once('open', function(){
    console.log('connected to db!');
})

//Middleware
app.use(express.json());
//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Server up and running'));