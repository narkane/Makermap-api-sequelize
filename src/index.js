//src/index.js

/*
* SETUP
*/
// const setup = require('./setup');
// const init = setup();
// SETUP EXPRESS
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();

const PORT = 3000;

/*////////////
* Routes//////
*/////////////
const apiRouter = require('./routes/api');

/*
* Express middleware
*/
//cross origin allow
app.use(cors({ origin: 'http://localhost:8080' , credentials :  true,  methods: 'GET,PUT,POST,DELETE', allowedHeaders: 'Content-Type,Authorization' }));
//parses incoming requests with body-parser JSON payloads
app.use(bodyParser.json());
//parses incoming requests with JSON payloads
app.use(express.json());
//parses incoming requests with URLencoded payloads
//extended: true - parsing URL-encoded data with the querystring library
app.use(express.urlencoded({extended: true}));
//route incoming requests with appropriate REST commands based on URL
//tells express to create url path "localhost:3000/api" with a "/users" route(directory)
app.use('/api', apiRouter);
// app.use('/api', usersRouter);

function onStart(){
    console.log(`SERVER: running on port ${PORT}`);
}

// app.get('/', (req, res) => res.send('Notes App'));

app.listen(PORT, onStart);

module.exports = app;