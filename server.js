// ======= DEPENDENCIES =======
// get .env variables
require('dotenv').config();
// pull PORT from .env, gibe default value of 4000
const { PORT = 4000, MONGODB_URL } = process.env;
// import express
const express = require('express');
// create app object
const app = express();
// import mongoose
const mongoose = require('mongoose');
// import middleware
const cors = require('cors');
const morgan = require('morgan')

// ======= DATABASE CONNECTION =======
// establish connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
// connection events
mongoose.connection
    .on('open', () => console.log('you are connected to mongoose'))
    .on('close', () => console.log('youre disconnected from mongoose'))
    .on('error', (error) => console.log(error))

// ======= MODELS =======
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})

const People = mongoose.model('People', PeopleSchema)

// ======= MIDDLEWARE =======
app.use(cors()); //to prevent cors errors, open access to all origins
app.use(morgan('dev')); //logging
app.use(express.json()); //parse json bodies

// ======= ROUTES =======
// create test route
app.get('/', (req,res) =>{
    res.send('hi world')
})

// people index route
app.get('/people', async (req, res) => {
    try {
        // send all people
        res.json(await People.find({}))
    } catch (error) {
        // send error
        res.status(400).json(error)
    }
})

// people create route
app.post('/people', async (req,res) =>{
    try {
        // send all people
        res.json(await People.create(req.body))
     } catch (error) {
        //  send error
        res.status(400).json(error);
     }
})

// people delete route
app.delete('/people/:id', async(req,res) => {
    try {
        // send all people
        res.json(await People.findByIdAndRemove(req.params.id))
    } catch (error) {
        // send error
        res.status(400).json(error)
    }
})

// people update route
app.put('/people/:id', async(req,res) =>{
    try {
        // send peeps
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
        )
    } catch (error) {
        // send them errors
        res.status(400).json(error);
    }
})

// ======= LISTENER =======
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))