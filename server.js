var express = require('express'),
app = express(),
bParser = require('body-parser'),
morgan = require('morgan'),
mongo = require('mongoose'),
passport = require('passport'),
config = require('./config/database'),
http = require('http'),
User = require("./models/user"),
jwt = require('jwt-simple');

app.use(bParser.urlencoded({ extended: false }));
app.use(bParser.json());
app.use(morgan('dev'))
app.use(passport.initialize());

app.get('/', function(req, res) {
  res.send("running at /api");
})

mongo.Promise = global.Promise;
mongo.connect(config.database);

require('./config/passport')(passport);

var route = express.Router();

route.post('/signup', function(req, res) {
  if(!req.body.uname || !req.body.pwd) {
    res.json({success: false, msg: "enter please"});
  }
  else{
    var newUser = new User({
      name: req.body.uname,
      password: req.body.pwd,
      userType: req.body.usertype
    });
    newUser.save(function(err) {
      if(err) {
        return res.json({success: false, msg: "Username already exists"});
      }else{
          res.json({success: true, msg: 'created'});
      }
    });
  }
});

route.post('/signin', function(req, res) {
  User.findOne({
    name: req.body.uname
  },function(err, user) {
    if(err) throw err;

    if(!user) {
      res.send({success: false, msg: 'Authentication failed'});
    } else {
      user.CompareP(req.body.pwd, function(err, Match) {
        if(Match) {
          var token = jwt.encode(user, config.secret);
          user.token = token;
          res.json({/*success:true,*/ token: 'JWT' + token, usertype: user.userType, a: 1});
        } else {
          res.send({/*success:false, msg:'failed'*/ a: 0});
        }
      })
    }
  })
})

app.use('/api', route);

http.createServer(app).listen(8090, "172.16.34.179");
