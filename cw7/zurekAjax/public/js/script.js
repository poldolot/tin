/* jshint browser: true, devel: true, unused: true, globalstrict: true */
/* global $: false */


'use strict';

var currentGenre;

var goRoot = function() {
    $('h1').removeClass('clickable').click(null);
    $('nav').removeClass('small');
    $('form').css('display', 'none');
    $('section h2').css('display', 'none');
    $('section table').remove();
};

function getShowGenre(genre) {
    return function() {
        $.getJSON('/genre/' + genre, function(data, status) {
            if (status == 'success') {
                currentGenre = genre;
                $('nav').addClass('small');
                $('h1').addClass('clickable').click(goRoot);
                $('section form').css('display', 'block');
                $('section table').remove();
                var table = $('<table></table>');
                $.each(data, function(index, value) {
                    var tr = $('<tr></tr>').append(
                        $('<td></td>').addClass('author').text(value[1] + ':'),
                        ' ',
                        $('<td></td>').addClass('title').text(value[0])
                    );
                    table.append(tr);
                });
                $('section h2').css('display', 'block').text(genre).after(table);
            } else alert(status);
        });
    };
};

var wyswietlKomunikat = function(tresc, blad) {
    var _blad = blad || !1;
    $('#komunikat p').text(tresc);
    if (_blad) {
        $('#komunikat').css('background', '#F00');
    } else {
        $('#komunikat').css('background', '');
    }
    var height = $('#komunikat').height();
    if (parseInt($('#komunikat').css('margin-top')) < 0) {
        $('#komunikat').animate({"margin-top": '+='+height});
        setTimeout(function(){
            $('#komunikat').animate({"margin-top": '-='+height});
        }, 2500);
    }
};

var zaloguj = function() {
    var form = $('<form id="login"></form>').append(
        $('<h3>Zaloguj się</h3>'),
        $('<p><span>Login: </span><input id="formLogin"></input></p>'),
        $('<p><span>Hasło: </span><input type="password" id="formPasswd"></input></p>'),
        $('<p><input type="submit" name="zaloguj" value="Zaloguj"></input><input type="button" name="anuluj" value="Anuluj" id="cancel"></input></p>')
    );
    $('body').prepend(form);
    $('body').prepend($('<div id="zaslona"></div>'));
    $('#zaslona, #login').addClass('active');
    $('#zaslona, #cancel').click(function() {
        $('#login, #zaslona').remove();
    });
    $('#login').submit(function() {
        var login = $('#formLogin').val(),
            passwd = $('#formPasswd').val();
        $.post('/login', {login: login, passwd: passwd})
            .done(function(data){
                if (data) {
                    $('#login').prepend($('<p class="blad">'+data+'</p>'));
                } else {
                    $('#login, #zaslona').remove();
                    $('#wyloguj').show();
                    postBook();
                }
            });
        return !1;
    })
    return !0;
};

var wyloguj = function() {
    $.get('/logout').done(function() {
        $('#wyloguj').hide();
        wyswietlKomunikat('Zostałeś poprawnie wylogowany.')
    });
};

var czyZalogowany = function(callback) {
    $.get('/loggedin')
        .done(function(data) {
            callback(data);
        });
};

var postBook = function() {
    var titleInput = $('section input').eq(0);
    var authorInput = $('section input').eq(1);
    var newTitle = titleInput.val();
    var newAuthor = authorInput.val();
    if (newTitle && newAuthor) {
        czyZalogowany(function(data) {
            if (data) {
                $.post('/dodaj/' + currentGenre, {title: newTitle, author: newAuthor})
                    .done(function(genre) {
                        getShowGenre(genre)();
                        titleInput.val('');
                        authorInput.val('');
                        wyswietlKomunikat('Pomyśnie dodano nową książkę')
                    });
            } else {
                zaloguj();
            }
        });
    } else {
        wyswietlKomunikat('Nie podałeś danych książki.', !0);
    }
    return false;
};

var setup = function() {
    $('section form').submit(postBook);
    $('body').prepend($('<div id="komunikat"><p></p></div>'));
    $('section').append($('<button id="wyloguj">Wyloguj</button>'));
    $('#wyloguj').on('click', wyloguj);
    czyZalogowany(function(data) {
        if (data) {
            $('#wyloguj').show();
        }
    });
    $.getJSON('/genres', function(data, status) {
        if (status == 'success') {
            $.each(data, function(index, value) {
                var li = $('<li></li>').text(value).addClass('clickable').click(getShowGenre(value));
                $('nav ul').append(li);
            });
        } else alert(status);
    });
};

$(document).ready(setup);