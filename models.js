const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  ImagePath: String,
  Featured: Boolean,
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: { type: String, required: true },
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

/**
 *
 * @param {*} password
 * @returns hashed pass in app
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 *
 * @param {*} password
 * @returns compared hashed passwords (login and saved in app) to verify when logging in
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let genreSchema = mongoose.Schema({
  Name: String,
  Description: String,
});

let directorsSchema = mongoose.Schema({
  Name: String,
  Bio: String,
  Birth: Number,
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorsSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;
