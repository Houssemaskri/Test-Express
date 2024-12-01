var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http'); // Import the http module
var socketIo = require('socket.io'); // Import socket.io

const mongoose = require('mongoose'); // Import mongoose
const configDb = require('./config/db.json'); // Import db.json file 



var indexRouter = require('./routes/index');
var livreRouter = require('./routes/livre'); // Import the livres router
const Livre = require('./models/livre');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/livre', livreRouter); // Use the livres router for the /livres route

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Create HTTP server and setup Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('getAvailableBooks', async () => {
    try {
      const availableBooksCount = await Livre.countDocuments({ available: true });
      socket.emit('availableBooksCount', availableBooksCount);
    } catch (error) {
      console.error('Error fetching available books count', error);
    }
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});





mongoose.connect(configDb.mongo.uri); // Connect to MongoDB


module.exports = {app, server};
