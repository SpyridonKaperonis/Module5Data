const mongoose = require('mongoose');
const moment = require('moment')

const schema = mongoose.Schema;

const AuthorSchema = new schema({
    firstName: {type: String, required: true, max:100},
    lastName:{type: String, required: true, max: 100},
    DOB:{type: Date },
    DOD:{type: Date }
});

AuthorSchema.virtual('name').get(function(){
    const fullname = '';

    if(this.firstName && this.lastName){
        fullname = this.lastName + ','+ this.firstName;
    }
    if(!this.firstName && !this.lastName){
        fullname = '';
    }
    return fullname;
});

AuthorSchema.virtual('url').get(function(){
    return '/catalog/author/' + this._id;
});

AuthorSchema.virtual('lifespan').get(function(){
    const lifetime = '';
    if(this.DOB){
        lifetime = moment(this.DOB).format('MMMM Do, YYYY')
    }
    lifetime += '-';
    if(this.DOB){
        lifetime += moment(this.DOB).format('MMMM Do, YYYY');
    }
    return lifetime;
});

AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function(){
    return moment(this.DOB).format('yyyy-mm-dd');
});

AuthorSchema.virtual('date_of_death_yyyy_mm_dd').get(function(){
    return moment(this.DOD).format('yyyy-mm-dd')
});

module.exports = mongoose.model('Author', AuthorSchema);