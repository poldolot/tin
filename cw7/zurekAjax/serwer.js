/*jshint node: true */
'use strict';

var express = require('express');
var app = express();
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var baza = require('./db/books');

app.use(session({
    secret: 'xxxyyyzzz',
    resave: false,
    saveUninitialized: true
}));
app.use(morgan('dev'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components/jquery/dist')));

app.get('/genres', function (req, res) {
    var genres = baza().distinct('genre');
    res.json(genres);
});

app.get('/genre/:gen', function (req, res) {
    var books = baza({genre: req.params.gen}).select('title', 'author');
    res.json(books);
});

app.get('/loggedin', function (req, res) {
    var loggedIn = !1;
    if (req.session && req.session.loggedIn) {
        loggedIn = !0;
    }
    res.send(loggedIn);
});

app.get('/logout', function (req, res) {
    req.session.loggedIn = !1;
    res.send(!0);
});

app.post('/dodaj/:gen', function (req, res) {
    var newAuthor=req.body.author;
    var newTitle=req.body.title;
    var genre = req.params.gen;
    baza.insert({author:newAuthor,title:newTitle, genre: genre});
    var genres = baza().distinct('genre').sort('genre');
    var books = baza({genre: genre}).select('title', 'author');
    res.send(genre);
});

app.post('/login', function (req, res) {
    var login = req.body.login;
    var password = req.body.passwd;
    var error = '';
    if (login == 'admin' && password == 'nimda') {
        req.session.loggedIn = !0;
    } else {
        req.session.loggedIn = !1;
        error = 'Podano błędny login lub hasło, wpis nie został dodany.';
    }
    res.send(error);
});

app.listen(3000, function () {
    console.log('Serwer działa na porcie 3000');
});


