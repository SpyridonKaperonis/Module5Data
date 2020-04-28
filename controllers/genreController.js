const Genre = require('../models/genre');
const book = require('../models/book');
const async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.genreList = function(req, res, next){
    Genre.find().sort([['name', 'ascending']]).exec(function(err, listGenres){
        if(err){return next(err);}
        res.render('genreList', {title: 'Genre List', listGenres: listGenres});
    });
};

exports.genreDetail = function(req, res, next){
    async.parallel({
        genre: function(callback){
            Genre.findById(req.params.id).exec(callback);
        },
        genreBooks: function(callback){
            book.find({'genre': req.params.id}).exec(callback);
        },
    },
    function(err, results){
        if(err){return next(err);}
        if(results.genre==null){
            const err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        res.render('genreDetail', {title: 'Genre Detail', genre: results.genre, genreBooks: results.genreBooks});
    });
};

exports.genreCreatePost = [

    
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),  
    sanitizeBody('name').escape(),

    (req, res, next) => {
  
        const errors = validationResult(req);

        const genre = new Genre(
          { name: req.body.name }
        );


        if (!errors.isEmpty()) {
           
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
        return;
        }
        else {
            
            Genre.findOne({ 'name': req.body.name })
                .exec( function(err, found_genre) {
                     if (err) { return next(err); }

                     if (found_genre) {
                        
                         res.redirect(found_genre.url);
                     }
                     else {

                         genre.save(function (err) {
                           if (err) { return next(err); }
                           
                           res.redirect(genre.url);
                         });

                     }

                 });
        }
    }
];

exports.genreDeleteGet = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function(callback) {
            book.find({ 'genre': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { 
            res.redirect('/catalog/genres');
        }
        
        res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
    });

};

exports.genreDeletePost = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function(callback) {
            book.find({ 'genre': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
       
        if (results.genre_books.length > 0) {
            res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
            return;
        }
        else {
            Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
                if (err) { return next(err); }
                res.redirect('/catalog/genres');
            });

        }
    });

};

exports.genreUpdateGet = function(req, res, next) {

    Genre.findById(req.params.id, function(err, genre) {
        if (err) { return next(err); }
        if (genre==null) { 
            const err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        
        res.render('genre_form', { title: 'Update Genre', genre: genre });
    });

};

exports.genreUpdatePost = [
   
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    
    sanitizeBody('name').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        const genre = new Genre(
          {
          name: req.body.name,
          _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors.array()});
        return;
        }
        else {
            Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err,thegenre) {
                if (err) { return next(err); }
                   res.redirect(thegenre.url);
                });
        }
    }
];
