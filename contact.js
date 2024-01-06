// Modules
const nodemailer = require('nodemailer');
const credentials = require(__dirname + "/config.js")
// Credentials
const email = credentials.email
const password = credentials.password
const to = credentials.to

// Service set up
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: password
    }
});

// sendEmail function
module.exports.sendEmail = function (req, res) {
    var mailOptions = {
        from: email,
        to: to,
        subject: req.body.subject,
        text: `Email: ${req.body.email}
        Phone Number: ${req.body.phoneNumber}
        Subject: ${req.body.subject}
        Message: ${req.body.message}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.render("contact-result.ejs", {
                heading: "Something went Wrong!",
                body: "Sorry about that, please try again later."
            })
        } else {
            console.log('Email sent: ' + info.response);
            res.render("contact-result.ejs", {
                heading: "Request received!",
                body: "Thank you, I will respond to you as soon as possible."
            })
        }
    });
}