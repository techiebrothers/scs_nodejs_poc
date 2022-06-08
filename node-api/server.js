const http = require('http');
const app = require('./app');

const port = process.env.PORT || 5004;

const server = http.createServer(app);
const io = require('socket.io')(server);

const User = require('./api/models/user.model');

server.on('listening', function () {
    // server ready to accept connections here
    console.log('call function');
});
io.on('connection', function (socket) {
    // console.log(socket);
    // socket.emit('news', { hello: 'world' });
});

exports.emitData = function (data, name) {
    io.emit('data', { data: data, name: name });
}


// server.listen(port);
let server1 = server.listen(port, function() {
	let host = server1.address().address
	let port = server1.address().port
	console.log("App listening at http://%s:%s", host, port)
})