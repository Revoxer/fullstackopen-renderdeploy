const express = require("express");
const app = express();
var morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(cors());

morgan.token("body", function (req) {
  return JSON.stringify(req.body || {});
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms ':body'",
  ),
);

let data = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, resesponse) => {
  resesponse.json(data);
});

app.get("/info", (request, resesponse) => {
  resesponse.send(`
    <p>Phonebook has info for ${data.length} people</p>
    <p>${new Date()}</p>
  `);
});

app.get("/api/persons/:id", (request, resesponse) => {
  const id = request.params.id;
  const person = data.find((person) => person.id === id);
  if (person) {
    resesponse.json(person);
  } else {
    resesponse.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, resesponse) => {
  const id = request.params.id;
  data = data.filter((person) => person.id !== id);
  resesponse.status(204).end();
});

app.post("/api/persons", (request, resesponse) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return resesponse.status(400).json({
      error: "name or number missing",
    });
  }
  if (data.find((person) => person.name === body.name)) {
    return resesponse.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000000),
  };
  data = data.concat(person);
  resesponse.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
