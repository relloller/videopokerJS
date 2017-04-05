//  ./api/model/mongodb.js
// mongoose.connect(uri, options);
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/videopokerjs');
mongoose.connection.on('connected', function() {
    console.log('connected videopokerjs db');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('disconnected videopokerjs db');
        process.exit(0);
    });
});
