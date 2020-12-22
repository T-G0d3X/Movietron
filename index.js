const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

let movies = [
  {
    title: 'Ace Ventura: Pet Detective',
    actor: 'Jim Carrey',
  },
  {
    title: 'Blade',
    actor: 'Wesley Snipes',
  },
  {
    title: 'Inglorious Bastards',
    actor: 'Brad Pitt',
  },
  {
    title: 'Lord of the rings',
    actor: 'Elijah Wood, Ian McKellen',
  },
  {
    title: 'Hobbit',
    actor: 'Martin Freeman',
  },
  {
    title: 'Looper',
    actor: 'Bruce Willis, J. Gordon-Levitt',
  },
  {
    title: 'Oblivion',
    actor: 'Tom Cruise',
  },
  {
    title: 'The Shawshank Redemption',
    actor: 'Morgan Freeman, Tim Robbins',
  },
  {
    title: 'Catch me if you can',
    actor: 'Leonrado DiCaprio',
  },
  {
    title: 'Godfather',
    actor: 'Marlon Brando',
  },
];

app.use(express.static('public'));

// ERROR-HANDLING MIDDLEWARE FUNCTION
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is not working!');
});

// Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Return data about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});
// app.get('/movies/title', (req, res) => {
//   res.send(
//     'Successful GET request returning data about a single movie by title to the user'
//   );
// });

// Return data about a genre (description) by name/title
app.get('/movies/genre', (req, res) => {
  res.send(
    'Successful GET request returning data about a about a GENRE by name/title'
  );
});

// Return data about a director by name
app.get('/movies/director', (req, res) => {
  res.send('Successful GET request returning data about a director');
});

// Allow new users to register
app.post('/movies/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    movies.push(newUser);
    res.status(201).send(newUser);
  }
});

// Allow users to update thier user info(username)
app.put('/movies/users/username', (req, res) => {
  res.send('Successful PUT request letting users change their username');
});

// Allow users to add a movie to their list of favorites
app.post('/movies/users/favorites', (req, res) => {
  res.send(
    'Successful POST request letting users add a movie to their list of favorites'
  );
});

// Allows user to remove a movie from their list of favorites
app.delete('/movies/users/favorites/list', (req, res) => {
  res.send(
    'Successful DELETE request removing a movie from their list of favorites'
  );
});

// Allow existing users to deregister
app.delete('/movies/users/email', (req, res) => {
  res.send('Successful DELETE request removing email');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
