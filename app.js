/**
 * dependencies
 */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    path = require('path'),
    bodyParser = require('body-parser'),
    moment = require('moment'),
    connections = {};

// set intervall
var interval = 1000;


app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json

/**
 * View engine setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * Routes
 */
app.get('/', function(req,res) {
    res.render('websocket', {title: 'Websockets'});
    //res.sendfile(__dirname + '/public/index.html');
});
app.use('/api', require('./routes/api'));

/**
 * Socket
 */
//connection
io.sockets.on('connection', function(socket) {

    // add a connection to the connections array
    connections[socket.id] = {
        "socket" : socket,
        "timezone" : undefined
    };
    // add a connection to the connections array and add a timezone
    socket.on('new timezone', function(data) {
        connections[socket.id] = {
            "socket" : socket,
            "timezone" : data.timezone
        };
    });

    // set intevall
    setInterval(function() {
        // set as utc timezone
        var now = moment().utc();

        // send an individual emit to all connection
        if(socket.id in connections)
        {
            // use the global timezone
            var timezone  = global.timezone;
            // if timezone is not undefined, use the defined timezone
            if (connections[socket.id].timezone != undefined)
            {
                timezone = connections[socket.id].timezone;
            }
            // set utc offset to current datetime
            now.utcOffset(parseInt(timezone));

            // format time and timezone
            var timeFormat =  now.format("H:mm:ss-E/MM/YYYY");
            var timezoneFormat = now.format("Z");

            // emmit on individual socket
            connections[socket.id].socket.emit('update', {time: timeFormat ,timezone: timezoneFormat});

        }

    }, interval);

    socket.on('disconnect', function(data) {
        // delete connection on disconnect
        delete connections[socket.id];
    });
});

/**
 * start server
 */
// run socket.io and express on a same port
app.start = app.listen = function(){
    console.log("The Server is running...");
    return server.listen.apply(server, arguments)
};

app.start(8888);
