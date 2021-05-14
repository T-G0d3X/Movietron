/**
 * New endpoint for the API with the URL /login, for registered users to log in. This code will authenticate login  *  requests using basic HTTP authentication and generate a JWT for the user
 *
 */
const jwtSecret = 'your_jwt_secret'; // needs to be the same key used in JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // Your local passport file

/**
 *
 * @param {string} user
 * @ returns JWT token
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username youre encoding in the JWT
    expiresIn: '7d', // token expire in 7 days
    algorithm: 'HS256', // algorithm used to "sign"(encode) the values of the JWT
  });
};

/**
 * POST login
 * @param {string} router
 */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
