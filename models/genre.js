const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Genreschema = new Schema({
    name: {type: String, require: true, min: 3, max: 100}
});

Genreschema.virtual('url').get(function(){
    return '/catalog/genre/'+this._id;
});


module.exports = mongoose.model('Genre', Genreschema);