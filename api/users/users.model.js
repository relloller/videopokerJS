// User schema
var mongoose = require('mongoose');
var crypto = require('crypto');
var jsonwebtoken = require('jsonwebtoken');



var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    credits: {
        type: Number,
        required: true,
        default: 500
    },
    name: String,
    role: {
        type: String,
        required: true,
        default: 'player'
    },
    pwHash: String,
    pwSalt: String
});

userSchema.methods.hashPassword = function(password) {
this.pwSalt = crypto.randomBytes(16).toString('hex');
this.pwHash = crypto.pbkdf2Sync(password, this.pwSalt, 1000, 64).toString('hex');
};

userSchema.methods.validatePassword = function(password) {
var pwHash = crypto.pbkdf2Sync(password, this.pwSalt, 1000, 64).toString('hex');
return this.pwHash === pwHash;
};

userSchema.methods.signJWT = function() {
var expiry = new Date();
expiry.setDate(expiry.getDate() + 1);

return jsonwebtoken.sign({
    username: this.username,
    name: this.name,
    role: this.role,
    exp: parseInt(expiry.getTime() / 1000),
}, 'upupdowndownleftrightleftrightbaselectstart');
};



module.exports = mongoose.model('Users', userSchema);


// var discountCodeOrderSchema = new mongoose.Schema({
//     discountCode_id: String,
//     discountCode_name: String,
//     dollarOff: Number,
//     percentOff: Number
// });

// var itemOrderSchema = new mongoose.Schema({
//     item_id: String,
//     order_id: String,
//     table_id: String,
//     item_name: String,
//     category_id: String,
//     price: Number,
//     quantity: Number,
//     itemOrderedTimeStamp: {type: Date, default: Date.now},
//     itemStatus: {type: String, default: 'open'},
//     itemServedTimeStamp: {type: Date}
// });


// var serviceRequestSchema = new mongoose.Schema({
//    serviceRequest: {type:String},
//    status: {type: String, default:'open'},
//    table_id: {type: String},
//    requestedTimeStamp: {type: Date, default: Date.now},
//    fulfilledTimeStamp: {type: Date}
// });



// var orderSchema = new mongoose.Schema({
//     table_id:{type: String, unique: true},
//     seatedTimeStamp: {type: Date, default: Date.now},
//     serviceRequests: [serviceRequestSchema],
//     submittedOrder: [itemOrderSchema],
//     orderStatus: {type:String, default: 'open'},
//     paymentStatus: {type:String, default: 'open'},
//     paymentTimeStamp: {type: Date},
//     subtotal: {type:Number, default: 0.0},
//     discountCodes: [discountCodeOrderSchema],
//     discountSavings: {type:Number, default: 0.0},
//     tip: {type: Number, default: 0.0},
//     tax: {type:Number, default: 0.0 },
//     total: {type:Number, default: 0.0},
//     paymentForm: {type: String, default: 'n'},
//     misc: String
// });

// module.exports = mongoose.model('Orders', orderSchema);

