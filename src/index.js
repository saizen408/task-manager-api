const express = require('express')
require('./db/mongoose') //ensures that mongoose.js runs and connects to mongodb
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express() //provides all the post, get, delete, update methods
const port = process.env.PORT





app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log(`Server is up on ${port}`)
})



