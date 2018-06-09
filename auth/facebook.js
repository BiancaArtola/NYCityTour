var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../app_server/models/User');

passport.use(new FacebookStrategy({
    clientID: "863010233882857",
    clientSecret: "dd7552c54381d2729ef9c03d46633628",
    callbackURL: "https://ciudadesturisticas.herokuapp.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("ESTOYYYYY ACAAAA");
    //console.log(User);
    User.findOrCreate({name: profile.displayName}, {name: profile.displayName,userid: profile.id}, function(err, user) {
      if (err) { 
        console.log("HUBO UN ERROR");
        return done(err); }
        console.log("todo BIEN");
      done(null, user);
    });
  }
));

module.exports = passport;