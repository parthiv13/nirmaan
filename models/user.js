var mongodb = require('mongoose'),
Schema = mongodb.Schema,
bcrypt = require('bcrypt');

var UserSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function(next) {
  var user = this;
  if(this.isModified('password') || this.isNew ) {
  bcrypt.hash(user.password, 10, function(err, hash) {
    user.password = hash;
    next();
  });
  }
  else return next();
})

UserSchema.methods.CompareP = function (pass, cb) {
  bcrypt.compare(pass, this.password, function(err, Match) {
    if(err) return cb(err);
    cb(null, Match);
  });
};

module.exports = mongodb.model('User', UserSchema);
