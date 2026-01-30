require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())

app.use(express.static('dist'))

morgan.token('body', function (req) {
  return JSON.stringify(req.body || {})
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms \':body\'',
  ),
)

app.get('/api/persons', (request, resesponse, next) => {
  Person.find({})
    .then((result) => {
      resesponse.json(result)
    })
    .catch((error) => {
      next(error)
    })
})

app.get('/info', (request, resesponse, next) => {
  Person.find({})
    .then((data) => {
      resesponse.send(`
    <p>Phonebook has info for ${data.length} people</p>
    <p>${new Date()}</p>
  `)
    })
    .catch((error) => {
      next(error)
    })
})

app.get('/api/persons/:id', (request, resesponse, next) => {
  const id = request.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        resesponse.json(person)
      } else {
        resesponse.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, resesponse, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      resesponse.status(204).end()
    })
    .catch((error) => {
      next(error)
    })
})

app.post('/api/persons', (request, resesponse, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      resesponse.json(savedPerson)
    })
    .catch((error) => {
      next(error)
    })
})

app.put('/api/persons/:id', (request, resesponse, next) => {
  const id = request.params.id
  const body = request.body

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return resesponse.status(404).end()
      }

      person.name = body.name
      person.number = body.number

      return person.save().then((savedPerson) => {
        resesponse.json(savedPerson)
      })
    })
    .catch((error) => {
      next(error)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)
