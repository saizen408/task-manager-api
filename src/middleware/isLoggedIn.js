// not in use

// const jwt = require('jsonwebtoken')
// const User = require('../models/user')

// const isLoggedIn = async (req, res, next) => {
//     try {

//         const user = await User.findOne({})
//         // const token = req.header('Authorization').replace('Bearer ', '')
//         // const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         // const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) //It's a MongoDB specific syntax. 'tokens.token' means "In the tokens array, search all the objects' token property for the following value".

//         // if(!user) {
//         //     throw new Error()
//         // }

//         // req.token = token
//         // req.user = user
//         next()
//     } catch (e) {
//         res.status(401).send({ error: 'You are already logged in on this device' })
//     }
// }

// module.exports = isLoggedIn