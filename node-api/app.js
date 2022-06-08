const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
require('dotenv').config()
const cors = require('cors');
const userRoutes = require('./api/routes/user.routes')
var path = require('path');

var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');


// mongoose.connect(
//   "mongodb://localhost:27017/PLS",
//   { useNewUrlParser: true }
// );
// mongoose.Promise = global.Promise;
global.dynamicMessages = [];
global.generalSettings = {};

var options = {
    customCss: `
  .swagger-ui .opblock-tag { font-size : 16px !important}
  .opblock .opblock-summary-path { font-size : 13px !important}
  .swagger-ui .parameter__name { font-size : 13px !important }
  .swagger-ui .wrapper { width: 80% !important }
  .swagger-ui input[type=text] {font-size : 13px !important}
  .swagger-ui input[type=file] {font-size : 13px !important}
  .swagger-ui div{font-size : 13px !important}
  .swagger-ui .execute-wrapper .btn {width : 15% !important}
  .swagger-ui .opblock.opblock-patch .opblock-summary-method {background : darkGreen !important}
  .swagger-ui .opblock.opblock-patch .opblock-summary{background : }`
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}
app.use(cors(corsOptions));



// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Headers", "Origin");
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");

// });

app.use((req, res, next) => {
    console.log('req', req);
    res.header("Access-Control-Allow-Headers", "Origin");
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    next();
});

app.use('/profile', express.static(__dirname + '/uploads/profile'));  //Todo Serve content files
app.use('/upload', express.static(__dirname + '/uploads'));  //Todo Serve content files

// Routes which should handle requests
app.use('/api/v1/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});



module.exports = app;
