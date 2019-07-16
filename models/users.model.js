const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Users = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  surname: String,
  date_of_birth: Date,
  books: Array
}, { versionKey: false,  timestamps:true });

Users.pre("save", function(next) {

    if(!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

Users.methods.comparePassword = function(plaintext, callback) {
    return callback(null, bcrypt.compareSync(plaintext, this.password));
};

module.exports = mongoose.model('users', Users );