const express = require('express'),
  morgan = require('morgan');

const app = express();

let topMovies = [
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

app.use(morgan('common'));

app.use(express.static('public'));

// ERROR-HANDLING MIDDLEWARE FUNCTION
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is not working!');
});

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my Movie app');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
