//  ./api/model/mongodb.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vegascodesdev');
mongoose.connection.on('connected', function() {
    console.log('connected vegascodes db');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('disconnected vegascodes db');
        process.exit(0);
    });
});
