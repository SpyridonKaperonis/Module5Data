const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
    book: {type: Schema.ObjectId, ref: 'Book', require: true},
    imprint: {type: String, require: true},
    status: {type: String, require: true, enum: ['Available', 'Maintenance', 'Loaded', 'Reserved'], default: 'Maintenance'},
    dueBack: {type: Date, default: Date.now},
});

BookInstanceSchema.virtual('url').get(function(){
    return '/catalog/bookinstance/'+this._id;
});

BookInstanceSchema.virtual('dueBackFormatted').get(function(){
    return moment(this.dueBack).format('MMMM Do, YYYY');
});

BookInstanceSchema.virtual('due_back_yyyy_mm_dd').get(function(){
    return moment(this.dueBack).format('YYYY-MM-DD');
})

module.exports = mongoose.model('BookInstance', BookInstanceSchema);