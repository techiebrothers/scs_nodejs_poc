
/* exports.findAll = function (req, res) {
    function sendResetPasswordEmail(receptionist, name, resetLink) {
        const nodemailer = require('nodemailer');

        fs.readFile(__dirname + '/../templates/admin.html', (err, templateData) => {
            if (err) throw err;

            let transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: process.env.SMTP_EMAIL_USER,
                    pass: process.env.SMTP_EMAIL_PASSWORD
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: 'google@gmail.com', // sender address
                to: receptionist, // list of receivers
                subject: 'Reset Your Password', // Subject line
                html: templateData.toString().replace('{{name}}', name).replace('{{resetLink}}', resetLink)
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('info', infow);
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            });
        });
    }
};
 */