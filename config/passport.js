var Jwt = require('passport-jwt').Strategy,
ExtractJWT = require('passport-jwt').ExtractJwt;
User = require('../models/user.js'),
config = require('./database');

module.exports = function(passport) {
  var opt = {};
  opt.jwtFromRequest = ExtractJWT.fromAuthHeader();
  opt.secretOrKey = config.secret;
  passport.use(new Jwt(opt, function(jwt, done) {
    User.findOne({id: jwt.id}, function(err, user) {
      if(err) return done(err, false);
      if(user) return done(null, user);
      else done(null, false);
    });
  }));
};
