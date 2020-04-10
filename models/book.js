const mongoose = require('mongoose');

const schema = mongoose.Schema;

const BookSchema = new schema({
    title: {type: String, required: true},
    author: {type: schema.ObjectId, ref: 'Author', required: true},
    summary: {type: String, required: true},
    isbn: {type: String, required: true},
    genre: [{type: schema.ObjectId, ref: 'Genre'}]
});

BookSchema.virtual('url').get(function(){
    return '/catalog/book/'+this._id;
});

module.exports = mongoose.model('Book', BookSchema);