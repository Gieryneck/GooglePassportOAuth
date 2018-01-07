/* 
Nasza apka(client, client application) bedzie potrzebowala dostepu do danych anonimowego dla niej
usera znajdujacych sie na Resource Server Googla. 

Na stronę z apką wejdzie anonimowy dla naszej apki user. Może zalogować się na naszą stronę używając swojego konta Google.
Authorization Server Google'a poprosi użytkownika o uwierzytelnienie siebie. Po tym uwierzytelnieniu user zostanie przekierowany
na strone googlowska na ktorej Google poinformuje go o tym że nasza apka żąda dostępu do jego danych(bedzie mial wyszczegolnione
do jakich konretnie). Jeśli user zgodzi się na dostep, to zostanie przekierowany z powrotem do naszej apki, konkretnie na 
http://localhost:3000/auth/google/callback. W tym przekierowaniu zawarty będzie Authorization Code - jest to kod dostępu dla apki
który musimy jeszcze pokazać Authorization Server, aby otrzymac access token. Access token zezwala na dostep do danych
usera na Resource Server(Authorization Server i Resource Server to może być ten sam server, ale nie musi). Wraz z access token
dostajemy jeszcze refresh token ktory pozwala na odnowienie access token gdy ten wygasnie. Po otrzymaniu Authorization Code
resztą zajmie się passport i Goggle Strategy.

*/

// http://www.passportjs.org/docs/google/

var express = require('express');
var passport = require('passport'); // middleware. Passport uses what are termed strategies to authenticate requests
// Authentication mechanisms, known as strategies, are packaged as individual modules
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy; // Google authentication mechanism
var config = require('./config');    
var app = express();
var googleProfile = {};


 /*  
 Serializacja – w programowaniu komputerów proces przekształcania obiektów, tj. instancji określonych klas, 
 do postaci szeregowej, czyli w strumień bajtów.
 
 Ponizej kod serializacji, obiekt user (który wrzucamy poniżej w skrypcie w zmienną googleProfile) zostanie przekazany
przeglądarce użytkownika jako cookie. Moglibyśmy użyć różnych fragmentów danych o userze jakie posiadamy, grunt 
by moc go jednoznacznie rozpoznac w celu uwierzytelnien w dalszych requestach jego przegladarki.
 Przy kolejnych requestach usera będziemy od tej pory mogli go rozpoznać po
tym ciasteczku, deserializując kod. Musimy wyciagnac usera z deserializeUser

https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize

*/

passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log(obj.id);
    done(null, obj);
});


passport.use(new GoogleStrategy({

    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL
},
    function (accessToken, refreshToken, profile, cb) {
        
        googleProfile = {
            id: profile.id,
            displayName: profile.displayName
        };
        cb(null, profile);
        /* Przy tworzeniu instancji klasy GoogleStrategy podajemy dane, które posiadamy w pliku config.js. 
        W odpowiedzi będziemy otrzymywać profil użytkownika, więc w tym miejscu przypiszemy go do zmiennej googleProfile. */
    }
));


app.set('view engine', 'pug');
app.set('views', './views');

app.use(passport.initialize());
app.use(passport.session());


// app routes
app.get('/', function(req, res){
    res.render('index', { name: 'OAuth App' });
});

app.get('/logged', function(req, res){
    res.render('logged', { name: 'OAuth App', user: googleProfile });
});

app.get('/next', function(req, res){
    res.render('next', { name: 'OAuth App', user: googleProfile });
});


// przekierowanie usera na strone google w celu uwierzytelnienia
app.get('/auth/google',
passport.authenticate('google', {
scope : ['profile', 'email']
}));

// przekierowanie powrotne do nas wraz z kodem autoryzacyjnym ktory passport wymienia na access token
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/logged');
  });

app.listen(3000);
console.log('Server running at http://localhost:3000/');




