/** ./api/videopoker/videopoker.model.js **/

var mongoose = require('mongoose');

var vpGameSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    wager: {
        type: Number,
        required: true
    },
    dealTime: {type:Date, default: Date.now},
    dealCards: [Number],
    holdCards: [Number],
    drawTime: {type:Date},
    drawCards: [Number],
    wagerResult: {
        type: Number,
        default: 0
    },
    handValue: {
        type: String
    }
});

module.exports = mongoose.model('VideoPoker', vpGameSchema);
