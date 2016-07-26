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
    dealCards: [Number],
    holdCards: [Number],
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
