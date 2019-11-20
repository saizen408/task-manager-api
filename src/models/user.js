const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema( { //defining a model
    name: {
        type: String,
        required: true,
        trim: true //removes spaces before or after the given value

    },
    email: {
        type: String,
        unique: true, //sends an index to mongoDB to ensure no duplicate email addresses are made
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password')
            }
            // } else if (value.length <= 6) {
            //     throw new Error('Password must be longer than 6 characters')
            // }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate (value) {
            if (value < 0) {
             throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer //allows us to store the buffer with the binary image data along side the user
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', { //tasks is name of the virtual field
    ref: 'Task', //reference the 'Task' model
    localField: '_id', //where the local data is stored
    foreignField: 'owner' //name of the field on the referenced Task
})

userSchema.methods.toJSON = function () {  //toJSON controls what JSON.stringify outputs. only happens with res.send
    const user = this
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function () { //methods are are accessable on the instances (instance methods)
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token

}

userSchema.statics.findByCredentials = async (email, password) => { //static methods are accessable on the model
    const user = await User.findOne({ email })

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//Delet user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User