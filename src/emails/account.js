const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to: 'llkoole7@gmail.com',
//     from: 'llkoole7@gmail.com',
//     subject: 'This is my first creation!',
//     text: 'I hope this once actually gets to you...'
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'owusueric@donotreply.com',
        subject: 'Welcome to the task app! Let\'s get productive',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send( {
        to: email,
        from: 'owusueric@donotreply.com',
        subject: `Sorry to see you go, ${name}!`,
        text: `Thanks for using the task app ${name}`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}