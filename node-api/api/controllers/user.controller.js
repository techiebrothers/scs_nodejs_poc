'use strict';
const User = require('../models/user.model');
const validator = require('../helpers/validate');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");
const fs = require("fs");


exports.login = function (req, res) {
    console.log("this call");
    const validationRule = {
        "email": "required|email",
        "password": "required|string|min:6"
    }
    validator(req.body, validationRule, {}, async (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Please enter correct email and password.',
                    data: err
                });
            res.end();
            return false;
        } else {
            var bytes = CryptoJS.AES.decrypt(req.body.password.toString(), process.env.CRYPTO_ENCRYPT_KEY);
            var decPassword = bytes.toString(CryptoJS.enc.Utf8);

            User.findByEmail(req, async function (err, results) {
                if (err) {
                    res.send({ success: false, message: 'error', error: err });
                } else {
                    if (results.length > 0 && results[0].status != 'deleted') {
                        if (decPassword.length <= 0) {
                            return res.status(400).send({
                                status: "error",
                                code: 400,
                                message: "Invalid email and password",
                                data: [],
                                error: []
                            });
                        }

                        const comparision = await bcrypt.compare(decPassword, results[0].password);
                        if (comparision) {
                            var user = results[0];
                            delete user.password;

                            const token = jwt.sign(
                                {
                                    email: results[0].email,
                                    id: results[0].id,
                                    role: results[0].role
                                },
                                process.env.JWT_KEY,
                                {
                                    expiresIn: "2h"
                                }
                            );
                            User.update_last_login(req, results[0].id, async function (err, results) {
                            });

                            // res.send({ success: true, message: "login sucessfull", token: token })
                            return res.status(200).json({
                                status: "success",
                                code: 200,
                                message: "LOGIN SUCCESS",
                                data: [
                                    {
                                        token: token
                                        // ,user: CryptoJS.AES.encrypt(user[0].role.toString(), process.env.CRYPTO_ENCRYPT_KEY).toString()
                                    }
                                ],
                                error: []
                            });
                        }
                        else {
                            // res.send({ success: false, message: "Email and password does not match" })
                            return res.status(401).json({
                                status: "error",
                                code: 401,
                                message: "Invalid email and password",
                                data: [],
                                error: []
                            });
                        }
                    }
                    else {
                        // res.send({ success: false, message: "Email does not exits" });
                        return res.status(401).json({
                            status: "error",
                            code: 401,
                            message: "Email is not found",
                            data: [],
                            error: []
                        });
                    }
                }
            });
        }
    });

};

exports.findAll = function (req, res) {
    req.body.status = req.body.status ? req.body.status : 'active';
    User.findAll(req, 2, function (err, totalRecords) {
        User.findAll(req, 1, function (err, resultsCount) {
            if (resultsCount.length) {
                User.findAll(req, 0, function (err, results) {
                    if (err) {
                        return res.status(400).send({
                            status: "error",
                            code: 400,
                            message: "Error",
                            data: [],
                            error: err
                        });
                    }

                    return res.status(200).json({
                        status: "success",
                        code: 200,
                        message: "SUCCESS",
                        data: results,
                        totalItems: resultsCount.length,
                        totalRecords: totalRecords.length,
                        error: []
                    });
                });
            } else {
                return res.status(200).json({
                    status: "success",
                    code: 200,
                    message: "SUCCESS",
                    data: [],
                    totalItems: 0,
                    totalRecords: totalRecords.length,
                    error: []
                });
            }
        });
    });
};
exports.resetToken = function (req, res) {
    var token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log('decoded', decoded);
    const tokennew = jwt.sign(
        {
            email: decoded.email,
            id: decoded.id,
        },
        process.env.JWT_KEY,
        {
            expiresIn: "2h"
        }
    );
    return res.status(200).json({
        status: "success",
        code: 200,
        message: "token_reset_success",
        token: tokennew,
        error: []
    });
};

exports.forgotPassword = (req, res, next) => {
    User.findByEmail(req, function (err, user) {
        if (err) {
            res.status(500).send({
                status: "error",
                code: 500,
                message: "Internal Server Error",
                data: [],
                error: err
            });
        } else {
            if (user.length < 1) {
                return res.status(401).json({
                    status: "error",
                    code: 401,
                    message: "email_not_exist",
                    data: [],
                    error: []
                });
            }
            const token = jwt.sign({ email: user[0].email, id: user[0].id }, process.env.JWT_KEY, { expiresIn: "5m" });
            User.update_reset_password_token(token, req.body.email, function (err, item) {
                if (err) {
                    return res.status(400).json({
                        status: "error",
                        code: 200,
                        message: err,
                        data: [],
                        error: []
                    });
                }

                sendResetPasswordEmail(user[0].email, user[0].name, 'http://localhost:4200/#/reset-password?token=' + token);
                return res.status(200).json({
                    status: "success",
                    code: 200,
                    message: "forgot_password_success",
                    data: [],
                    error: []
                });
            });
        }
    })
};
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
exports.resetRequestValidate = (req, res, next) => {
    req.body.email = req.loged_user.email;
    User.findByEmail(req, function (err, user) {
        if (err) {
            res.status(500).send({
                status: "error",
                code: 500,
                message: "Internal Server Error",
                data: [],
                error: err
            });
        } else {
            if (user[0].reset_token !== req.headers.authorization.split(" ")[1]) {
                return res.status(404).json({
                    status: "error",
                    code: 404,
                    message: "No Request Found!",
                    data: [],
                    error: []
                });
            }
            return res.status(200).json({
                status: "OK",
                code: 200,
                message: "Reset Validate Success",
                data: [],
                error: []
            });
        }
    })
};
exports.resetPassword = (req, res, next) => {
    req.body.email = req.loged_user.email;
    User.findByEmail(req, function (err, user) {
        if (err) {
            res.status(500).send({
                status: "error",
                code: 500,
                message: "Internal Server Error",
                data: [],
                error: err
            });
        } else {
            if (user[0].reset_token !== req.headers.authorization.split(" ")[1]) {
                return res.status(404).json({
                    status: "error",
                    code: 404,
                    message: "no_reset_request_found",
                    data: [],
                    error: []
                });
            }


            var bytes = CryptoJS.AES.decrypt(req.body.password.toString(), process.env.CRYPTO_ENCRYPT_KEY);
            var decPassword = bytes.toString(CryptoJS.enc.Utf8);

            if (decPassword.length <= 0) {
                return res.status(400).json({
                    status: "error",
                    code: 400,
                    message: "Format not valid",
                    data: [],
                    error: []
                });
            }

            bcrypt.hash(decPassword, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        status: "error",
                        code: 500,
                        message: "Internal Server Error",
                        data: [],
                        error: err
                    });
                } else {
                    var item = {
                        password: hash,
                        email: req.loged_user.email,
                        token: ''
                    };
                    User.update_reset_password(item, function (err, user) {
                        if (err) {
                            return res.status(500).json({
                                status: "error",
                                code: 500,
                                message: "Internal Server Error",
                                data: [],
                                error: err
                            });
                        } else {


                            return res.status(200).json({
                                status: "OK",
                                code: 200,
                                message: "password_reset_success",
                                data: [],
                                error: []
                            });
                        }
                    });
                }
            });
        }
    })

};
exports.resetUserPassword = (req, res, next) => {
    req.body.email = req.loged_user.email;
    User.findById(req, req.body.id, function (err, user) {
        if (err) {
            res.status(500).send({
                status: "error",
                code: 500,
                message: "Internal Server Error",
                data: [],
                error: err
            });
        } else {
            var bytes = CryptoJS.AES.decrypt(req.body.password.toString(), process.env.CRYPTO_ENCRYPT_KEY);
            var decPassword = bytes.toString(CryptoJS.enc.Utf8);

            if (decPassword.length <= 0) {
                return res.status(400).json({
                    status: "error",
                    code: 400,
                    message: "Format not valid",
                    data: [],
                    error: []
                });
            }

            bcrypt.hash(decPassword, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        status: "error",
                        code: 500,
                        message: "Internal Server Error",
                        data: [],
                        error: err
                    });
                } else {

                    req.body.password = hash;
                    req.body.updated_by = req.loged_user.id;
                    User.reset_user_password(req, function (err, userReseted) {
                        if (err) {
                            return res.status(500).json({
                                status: "error",
                                code: 500,
                                message: "Internal Server Error",
                                data: [],
                                error: err
                            });
                        } else {
                            console.log('user[0]', user[0]);
                            if (req.body.notify == '1') {
                                var data = {
                                    subject: 'Your password has changed!',
                                    username: user[0].name,
                                    to: user[0].email,
                                    email: user[0].email,
                                    password: decPassword,
                                };
                                sendEmail(data, 'reset_user_password.html');
                            }


                            return res.status(200).json({
                                status: "success",
                                code: 200,
                                message: "user_password_reset_success",
                                data: [],
                                error: []
                            });
                        }
                    });
                }
            });
        }
    })

};

exports.findById = async function (req, res) {
    const user_id = +req.params.id ? +req.params.id : req.loged_user.id;
    if (!user_id) {
        res.status(500).send({
            status: "error",
            code: 500,
            message: "Invalid request",
            data: [],
            error: {}
        });
    }
    User.findById(req, user_id, function (err, user) {
        if (err) {
            // res.send({ success: false, message: 'error', error: err });

            res.status(500).send({
                status: "error",
                code: 500,
                message: "Internal Server Error",
                data: [],
                error: err
            });
        } else {
            var result = {
                userDetails: {
                    id: user[0].id,
                    name: user[0].name,
                    first_name: user[0].first_name,
                    last_name: user[0].last_name,
                    email: user[0].email,
                    phone: user[0].phone,
                    role: user[0].role,
                    profile_picture: user[0].profile_picture,
                    reset_request: user[0].reset_request,
                    reset_token: user[0].reset_token
                }
            };

            return res.status(200).send({
                type: 'user',
                status: "success",
                code: 200,
                message: "USER SUCCESS",
                data: result,
                error: []
            });
        }
    });
};
exports.getMenu = async function (req, res) {
    const user_id = +req.params.id ? +req.params.id : req.loged_user.id;
    if (!user_id) {
        res.status(500).send({
            status: "error",
            code: 500,
            message: "Invalid request",
            data: [],
            error: {}
        });
    }
    User.findById(req, user_id, function (err, user) {
        if (err) {
            res.status(500).send({
                status: "error",
                code: 500,
                message: "Internal Server Error",
                data: [],
                error: err
            });
        } else {
            var result = {
                userDetails: {
                    id: user[0].id,
                    name: user[0].name,
                    first_name: user[0].first_name,
                    last_name: user[0].last_name,
                    email: user[0].email,
                    phone: user[0].phone,
                    role: user[0].role,
                    profile_picture: user[0].profile_picture,
                    reset_request: user[0].reset_request,
                    reset_token: user[0].reset_token
                },
            };
            return res.status(200).send({
                type: 'user',
                status: "success",
                code: 200,
                message: "USER SUCCESS",
                data: result,
                error: []
            });
        }
        // res.json({ success: true, message: "success", result: item });
    });
};

exports.changePassword = (req, res, next) => {
    User.findById(req, req.loged_user.id, function (err, user) {
        if (err) {
            // res.send({ success: false, message: 'error', error: err });

            res.status(500).send({
                status: "error",
                code: 500,
                message: "Internal Server Error",
                data: [],
                error: err
            });
        } else {
            if (user.length < 1) {
                return res.status(404).json({
                    status: "error",
                    code: 404,
                    message: "User Not Found",
                    data: [],
                    error: []
                });
            }

            var cbytes = CryptoJS.AES.decrypt(req.body.currentPassword.toString(), process.env.CRYPTO_ENCRYPT_KEY);
            var cdecPassword = cbytes.toString(CryptoJS.enc.Utf8);
            if (cdecPassword.length <= 0) {
                return res.status(400).json({
                    status: "error",
                    code: 400,
                    message: "Format not valid",
                    data: [],
                    error: []
                });
            }
            bcrypt.compare(cdecPassword, user[0].password, (err, result) => {
                if (err) {
                    return res.status(403).json({
                        status: "error",
                        code: 403,
                        message: "current_password_is_invalid",
                        data: [],
                        error: []
                    });
                }
                if (result) {
                    var bytes = CryptoJS.AES.decrypt(req.body.password.toString(), process.env.CRYPTO_ENCRYPT_KEY);
                    var decPassword = bytes.toString(CryptoJS.enc.Utf8);
                    if (decPassword.length <= 0) {
                        return res.status(400).json({
                            status: "error",
                            code: 400,
                            message: "Format not valid",
                            data: [],
                            error: []
                        });
                    }

                    bcrypt.hash(decPassword, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                status: "error",
                                code: 500,
                                message: "Internal Server Error",
                                data: [],
                                error: err
                            });
                        } else {

                            User.changePassword(req.loged_user.id, hash, function (err, item) {
                                if (err) {
                                    return res.status(500).json({
                                        status: "error",
                                        code: 500,
                                        message: "Internal Server Error",
                                        data: [],
                                        error: err
                                    });
                                }


                                return res.status(200).json({
                                    status: "success",
                                    code: 200,
                                    message: "password_changed_success",
                                    data: [],
                                    error: []
                                });
                            });
                        }
                    });
                } else {
                    res.status(403).json({
                        status: "error",
                        code: 403,
                        message: "current_password_is_invalid",
                        data: [],
                        error: []
                    });
                }
            });
        }
    });
};

exports.create = async function (req, res) {
    req.body.profile_picture = req.files.profile_picture && req.files.profile_picture.length ? req.files.profile_picture[0].filename : '';
    req.body.created_by = req.loged_user ? req.loged_user.id : 0;
    req.body.name = req.body.name ? req.body.name : req.body.first_name + ' ' + req.body.last_name;
    const access = req.body.access;


    delete req.body.access;
    const new_item = new User(req.body);
    const validationRule = {
        "first_name": "required|string",
        "last_name": "required|string",
        "email": "required|email",
        "password": "string|min:6",
    }
    validator(req.body, validationRule, {}, async (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
            res.end();
            return false;
        } else {
            // handles null error
            if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.status(400).send({ success: false, message: 'Please provide all required field' });
            } else {

                User.findByEmail(req, async function (err, item) {
                    if (item.length > 0 && new_item.id < 1) {
                        return res.status(400).send({
                            status: "error",
                            code: 400,
                            message: "Email already exist",
                            data: [],
                            error: err
                        });
                    }

                    if (new_item.id > 0) {
                        User.update(new_item, function (err, item) {
                            if (err) {
                                return res.status(400).send({
                                    status: "error",
                                    code: 400,
                                    message: "Error",
                                    data: [],
                                    error: err
                                });
                            }

                            return res.status(200).json({
                                status: "success",
                                code: 200,
                                message: "User updated",
                                data: item,
                                totalItems: 0,
                                error: []
                            });
                        });
                    } else {
                        var bytes = CryptoJS.AES.decrypt(new_item.password.toString(), process.env.CRYPTO_ENCRYPT_KEY);
                        var decPassword = bytes.toString(CryptoJS.enc.Utf8);
                        if (decPassword.length <= 0) {
                            return res.status(400).json({
                                status: "error",
                                code: 400,
                                message: "Format not valid",
                                data: [],
                                error: []
                            });
                        }

                        bcrypt.hash(decPassword, 10, (err, hash) => {
                            if (err) {
                                return res.status(500).json({
                                    status: "error",
                                    code: 500,
                                    message: "Internal Server Error",
                                    data: [],
                                    error: err
                                });
                            } else {
                                new_item.password = hash;

                                User.create(new_item, function (err, item) {
                                    if (err) {
                                        res.send({ success: false, message: 'error', error: err });
                                        return false;
                                    }

                                    return res.status(200).json({
                                        status: "success",
                                        code: 200,
                                        message: "Registration success",
                                        data: item,
                                        totalItems: 0,
                                        error: []
                                    });
                                });
                            }
                        });
                    }
                });
            }
        }
    });

};

exports.update = function (req, res) {
    const email = req.param('email');
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ success: false, message: 'Please provide all required field' });
    } else {
        User.update(email, new User(req.body), function (err, item) {
            const user_id = item.affectedRows;
            if (err)
                res.send({ success: false, message: 'error1', error: err });

            req.body.email = email;
            User.findByEmail(req, function (err, item) {
                if (err) {
                    res.send({ success: false, message: 'error', error: err });
                    return false;
                }
                const values = {
                    user_id: item[0].id,
                    access: req.body.access_level
                }
                User.update_permission(values, function (err, item) {
                    if (err) {
                        res.send({ success: false, message: 'error', error: err });
                        return false;
                    }
                    res.json({ success: true, message: "user_updated_success" });
                });
            });
        });
    }
};
exports.delete = async function (req, res) {

    User.findById(req, req.params.id, function (err, user) {
        if (err) {
            res.send({ success: false, message: 'error', error: err });
            return false;
        }

        User.delete(req.params.id, req.params.is_hard, function (err, item) {
            if (err)
                res.send({ success: false, message: 'error', error: err });



            return res.status(200).json({
                status: "success",
                code: 200,
                message: "user_deleted_success",
                data: [],
                totalItems: 0,
                error: []
            });
        });
    });
};




function sendEmail(data, template) {
    const nodemailer = require('nodemailer');

    fs.readFile(__dirname + '/../templates/' + template, (err, templateData) => {
        if (err) throw err;

        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_EMAIL_USER,
                pass: process.env.SMTP_EMAIL_PASSWORD
            }
        });

        templateData = templateData.toString()
        templateData = templateData.replace('{{username}}', data.username);
        templateData = templateData.replace('{{email}}', data.email);
        templateData = templateData.replace('{{password}}', data.password);

        // setup email data with unicode symbols
        let mailOptions = {
            from: generalSettings.noreply_email.value,
            // from: process.env.NOREPLY_EMAIL, // sender address
            to: data.to, // list of receivers
            // cc: data.cc, // list of receivers
            subject: data.subject, // Subject line
            html: templateData
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
exports.getClassUsers = function (req, res) {
    req.body.status = req.body.status.length ? req.body.status : 'active';

    User.getClassUsers(req, 0, function (err, results) {
        if (err) {
            return res.status(400).send({
                status: "error",
                code: 400,
                message: "Error",
                data: [],
                error: err
            });
        }

        return res.status(200).json({
            status: "success",
            code: 200,
            message: "SUCCESS",
            data: results,
            error: []
        });
    });
};