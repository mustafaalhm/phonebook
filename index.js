const express = require("express");

const app = express();
var morgan = require('morgan')


app.use(express.json());
app.use(express.static('dist'))

morgan.token("req-body",(req)=>{
  if(req.method === "POST"){
    return JSON.stringify(req.body)
  }
  return "";
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"));




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

app.get("/api/persons", (request, response) => {
  return response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const result = persons.find((person) => person.id === id);
  if (!result) {
    response.status(404).send("not found");
    console.log("not not not");
  }
  response.json(result);
});

app.get("/info", (request, response) => {
  response.send(
    `phonebook has info for ${persons.length}  people <br> <br> ${Date()}`
  );
});
// delete person
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  // check if found
  let found = persons.find((person) => person.id === id);
  if (!found) {
    res.send("invalid id");
  }
  const person = persons.filter((person) => person.id !== id);
  res.send(person);
});
// create new
app.post("/api/persons", (req, res) => {
  try {
   
    let newPerson = req.body;
    
  if(!newPerson.name){
    res.status(400).send("please enter name")
  }else if(!newPerson.number ){
    res.status(400).send("please enter number")
  }
  let found = persons.find((person)=>person.name === newPerson.name)
  if(found){
    res.status(400).send(`${newPerson.name} is exists ,name must be uniqe`)
  }
     newPerson.id = generateId();
    persons = persons.concat(newPerson);

    res.send(persons);
  
 
   
  } catch (error) {
    console.log({ error });
  }
});
const generateId = () => {
  const maxId = persons.length > 0 ? Math.floor(Math.random() * 200) : 0;
  return maxId;
};


const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});