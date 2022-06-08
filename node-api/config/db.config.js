'use strict';
const mysql = require('mysql');
//local mysql db connection
/* const dbConn = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'hindi_teacher'
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'bf036995748210',
    password: '5163c347',
    database: 'heroku_d8cde9444997654'
});
dbConn.connect(function (err) {
    if (err) {
        console.log('err >>>>>>>>>>>>>>>>>>> ', err);
        // return true;
        throw err;
    }
    console.log("Database Connected!!!");
}); */



var db_config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_demo',

    // host: 'us-cdbr-east-04.cleardb.com',
    // user: 'bf036995748210',
    // password: '5163c347',
    // database: 'heroku_d8cde9444997654',

    // host: 'remotemysql.com',
    // user: '6iUSjtHRQ5',
    // password: '8yQokG52yy',
    // database: '6iUSjtHRQ5',

    connectionLimit: 15,
    queueLimit: 30,
    acquireTimeout: 1000000,
    multipleStatements: true

};
var dbConn;
function handleDisconnect() {
    dbConn = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.

    dbConn.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
        console.log("Database Connected!!!");
    });                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    dbConn.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();



//- Create the connection variable
/* var dbConn = mysql.createConnection(db_config);

//- Establish a new connection
dbConn.connect(function(err){
    if(err) {
        // mysqlErrorHandling(connection, err);
        console.log("\n\t *** Cannot establish a connection with the database. ***");

        dbConn = reconnect(dbConn);
    }else {
        console.log("\n\t *** New connection established with the database. ***")
    }
});

//- Reconnection function
function reconnect(dbConn){
    console.log("\n New connection tentative...");

    //- Destroy the current connection variable
    if(dbConn) dbConn.destroy();

    //- Create a new one
    var dbConn = mysql.createConnection(db_config);

    //- Try to reconnect
    dbConn.connect(function(err){
        if(err) {
            //- Try to connect every 2 seconds.
            setTimeout(reconnect, 2000);
        }else {
            console.log("\n\t *** New connection established with the database. ***")
            return dbConn;
        }
    });
}

//- Error listener
dbConn.on('error', function(err) {

    //- The server close the connection.
    if(err.code === "PROTOCOL_CONNECTION_LOST"){    
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        // dbConn = reconnect(dbConn);
        reconnect(dbConn);
    }

    //- Connection in closing
    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        // dbConn = reconnect(dbConn);
        reconnect(dbConn);
    }

    //- Fatal error : connection variable must be recreated
    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        reconnect(dbConn);
    }

    //- Error because a connection is already being established
    else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
    }

    //- Anything else
    else{
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        // dbConn = reconnect(dbConn);
        reconnect(dbConn);
    }

}); */

module.exports = dbConn;