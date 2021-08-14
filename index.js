require('dotenv').config();

const express = require('express');
const app = express();

const morgan = require('morgan');
const cors = require('cors');

app.use(express.static('build'));
app.use(cors());
app.use(express.json());

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'));

const Person = require('./models/person');

// #region GETTERS
app.get('/',
  (request, response) => {
    res.send('<h1>Hello, World!</h1>');
  });

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(result => {
      response.json(result);
    })
    .catch(error => next(error))
});

app.get('/info', (request, response) => {
  Person.find({})
    .then(result => {
      let res = 'Phonebook has info for ' + result.length + ' people';
      res += '<p> ' + Date(Date.now()).toString() + '<p>';
      response.send(res);
    })
    .catch(error => next(error))
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person);
    })
    .catch(error => next(error))
});

// #endregion GETTERS

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'Content name missing'
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'Content number missing'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error))
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  console.log('Put request:', body);

  const person = new Person({
    name: body.name,
    number: body.number
  });

  Person.findByIdAndUpdate(request.params.id, {number: body.number}, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// #region Middleware

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
}

app.use(errorHandler);

// #endregion Middleware

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
