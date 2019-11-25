const path = require('path')
const express = require('express')
const hbs = require('hbs')
const handlebars = require('handlebars')
require('./db/mongoose') //ensures that mongoose.js runs and connects to mongodb
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express() //provides all the post, get, delete, update methods

const publicDirectoryPath = path.join(__dirname, '../public') //Defines path to the public folder with static assets
const viewsPath = path.join(__dirname, '../templates/views') //Defines path to the templates folder with dynamic assets
const partialsPath = path.join(__dirname, '../templates/partials')


//Setup handlebars engine and views/partials location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


module.exports = app


