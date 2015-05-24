/*jshint globalstrict: true, devel: true, node: true */
'use strict';

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var baza = require('./db/books');
var fs = require('fs');


app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    var genres = baza().distinct("genre").sort("genre");
    res.render('index.ejs', {genres: genres});
});

app.get('/:gen', function (req, res) {
    var genres = baza().distinct("genre").sort("genre");
    var books = baza({genre: req.params.gen}).select("title", "author");
    var genre = req.params.gen;
    var error = '';
    res.render('index.ejs', {genres: genres, books: books, genre: genre, error: error});
});

app.post('/:gen', function (req, res) {
    var newAuthor=req.body.author;
    var newTitle=req.body.title;
    var login = req.body.login;
    var password = req.body.password;
    var genre = req.params.gen;
    var error = '';
    if (login == 'admin' && password == 'nimda') {
        baza.insert({author:newAuthor,title:newTitle, genre: genre});
    } else {
        error = 'Podano błędny login lub hasło, wpis nie został dodany.';
    }
    var genres = baza().distinct("genre").sort("genre");
    var books = baza({genre: genre}).select("title", "author");
    res.render('index.ejs', {genres: genres, books: books, genre: genre, error: error});
});


app.listen(3000, function () {
    console.log('Serwer działa na porcie 3000');
});

process.on('SIGINT',function(){
  console.log('\nshutting down');
  var text = "var TAFFY = require('taffy');\n\nvar books = TAFFY(";
    text += baza().stringify();
    text += ");\n\nmodule.exports = books;";
    fs.writeFile('./db/books.js', text, function (err,data) {
      if (err) console.log(err);
      process.exit();
    });

});
