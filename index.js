/**
 * API for movietron project
 * index.js is the main entry point. This document show the different functions
 * and endpoints for the api.
 */

const port = process.env.PORT || 8080;
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Models = require('./models.js');
const express = require('express'),
  bodyParser = require('body-parser');
const morgan = require('morgan');
const { response } = require('express');
const { property } = require('lodash');
const cors = require('cors');
const app = express();
app.use(cors());
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * Log request to server
 */
app.use(morgan('common'));
app.use(bodyParser.json());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is not working!');
});

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

// default text response when at  / homepage

app.get('/', (req, res) => {
  res.send('Welcome to my Movietron app!');
});

/**
 * Return a list of ALL movies to the user
 */
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * Get movie info using specific title
 */
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * Get all genres
 */
app.get(
  '/genres',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Genres.find()
      .then((genre) => {
        res.status(201).json(genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * Get JSON genre info when looking for specific genre
 */
app.get(
  '/genres/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Genres.findOne({ Name: req.params.Name })
      .then((genre) => {
        res.json(genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
      });
  }
);

/**
 *  Return data about a director by name
 */
app.get(
  '/directors/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Directors.findOne({ Name: req.params.Name })
      .then((director) => {
        res.json(director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * Get all users
 */
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * Get a user by username
 */
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * Allow new users to register
 */
app.post(
  '/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non aplhanumeric characers - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    // checks the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users.create({
            Username: req.body.Username, //req.body- request that the user sends
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

/**
 * users add a movie to user list of favorites
 */
app.post(
  '/users/:Username/Movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * users REMOVE a movie from user list of favorites
 */
app.delete(
  '/users/:Username/Movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Allow users to update thier user info(by username)
 */
app.put(
  '/users/:Username',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 *  Delete a user by username
 */
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * Allow existing users to remove email(deregister)
 */
app.delete(
  '/users/:Name/:Email',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Email: req.params.Email })
      .then((email) => {
        if (!email) {
          res.status(400).send(req.params.Email + ' was not found');
        } else {
          res.status(200).send(req.params.Email + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
