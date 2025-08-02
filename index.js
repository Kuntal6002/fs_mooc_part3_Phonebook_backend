const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static('dist'))
app.use(express.json());

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
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

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    return res.json(person);
  } else {
    return res.status(404).end();
  }
});

//Generating Uid for post request
const generateId = () => {
  const MaxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
  return String(MaxId + 1);
};
//Post request for sending a request
app.post("/api/persons/", (req, res) => {
  const body = req.body;
  const personFound = persons.find((person) => person.name === body.name);
  if (personFound) {
    return res.status(400).json({ error: "Name must be unique" });
  }
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "Name or Number field is missing" });
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.get("/info", (req, res) => {
  const length = persons.length;
  const date = new Date();
  res.send(`Phone book has info for ${length} people <br>${date}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}...`);
});
