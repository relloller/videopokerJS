//  ./api/model/mongodb.js
var options = {
  db: { native_parser: true },
  // server: { poolSize: 5 },
  // replset: { rs_name: 'myReplicaSetName' },
  user: 'vegascodesdev',
  pass: 'v3g@sc0d3s'
}
// mongoose.connect(uri, options);
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vegascodesdev', options);
mongoose.connection.on('connected', function() {
    console.log('connected vegascodes db');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('disconnected vegascodes db');
        process.exit(0);
    });
});
