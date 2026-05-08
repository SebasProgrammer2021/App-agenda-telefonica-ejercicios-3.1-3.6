require('dotenv').config()
const express = require('express');
const { persons } = require('./data');
const app = express();
const morgan = require('morgan');
const PORT = process.env.PORT || 3001
const Person = require('./models/person');
const errorHandler = require('./middlewares/errorhandler');

app.use(express.json());

// Configurar morgan para registrar el cuerpo de las solicitudes POST, creando un token personalizado llamado 'post-data' que se utiliza para mostrar el cuerpo de la solicitud en los registros de morgan. Si la solicitud no es de tipo POST, el token devolverá un guion ('-') para indicar que no hay datos de publicación disponibles.
morgan.token('post-data', (req) => {
  if (req.method !== 'POST') {
    return '-';
  }

  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// ejercicio 3.1
app.get('/api/persons', (req, res, next) => {
  // FORMA 1 - con datos estáticos
  // res.json(persons);

  // FORMA 2 - con datos de MongoDB
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    // .catch(error => {
    //   console.error('Error fetching persons from MongoDB:', error.message);
    //   res.status(500).json({ error: 'Internal server error' });
    // });
    .catch(error => next(error)); // Pasar el error al middleware de manejo de errores
});

// ejercicio 3.2
app.get('/info', (req, res, next) => {
  // const totalPersons = persons.length;
  // const currentDate = new Date();
  // res.send(`Phonebook has info for ${totalPersons} people<br>${currentDate}`);

  // FORMA 2 - con datos de MongoDB
  // countdocuments es un método de Mongoose que se utiliza para contar el número de documentos en una colección que coinciden con una consulta específica. En este caso, se está utilizando Person.countDocuments({}) para contar todos los documentos en la colección de personas, ya que se le pasa un objeto vacío como consulta, lo que significa que no se aplican filtros y se cuentan todos los documentos disponibles.
  Person.countDocuments({})
    .then(totalPersons => {
      const currentDate = new Date();
      res.send(`Phonebook has info for ${totalPersons} people<br>${currentDate}`);
    })
    .catch(error => next(error)); // Pasar el error al middleware de manejo de errores
});

// ejercicio 3.3
app.get('/api/persons/:id', (req, res, next) => {
  // const personId = Number(req.params.id);
  // const targetPerson = persons.find(person => person.id === personId);

  // if (!targetPerson) {
  //   return res.status(404).json({ error: 'Person not found' });
  // }

  // res.json(targetPerson);

  // FORMA 2 - con datos de MongoDB
  const personId = req.params.id;
  Person.findById(personId)
    .then(targetPerson => {
      if (!targetPerson) {
        return res.status(404).json({ error: 'Person not found' });
      }
      res.json(targetPerson);
    })
    .catch(error => next(error));
});

// ejercicio 3.4
app.delete('/api/persons/:id', (req, res, next) => {
  // const personId = Number(req.params.id);
  // const index = persons.findIndex(person => person.id === personId); // Encontrar el índice de la persona a eliminar, findIndex devuelve -1 si no encuentra el elemento

  // if (index === -1) {
  //   return res.status(404).json({ error: 'Person not found' });
  // }

  // persons.splice(index, 1); // splice elimina el elemento del array en el índice encontrado, el segundo argumento indica cuántos elementos eliminar (en este caso, solo uno)
  // res.status(204).end();


  // FORMA 2 - con datos de MongoDB
  const personId = req.params.id;
  Person.findByIdAndDelete(personId)
    .then(deletedPerson => {
      if (!deletedPerson) {
        return res.status(404).json({ error: 'Person not found' });
      }
      res.status(204).end();
    })
    .catch(error => next(error)); // Pasar el error al middleware de manejo de errores
});

// ejercicio 3.5  agregar una persona 
app.post('/api/persons', async (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' });
  }

  // validar si el nombre ya existe
  // FORMA 1 - con datos estáticos
  // const isNameRegistered = persons.some(person => person.name === name); // some devuelve true si al menos un elemento del array cumple con la condición, en este caso, si el nombre ya existe en el array de personas

  // FORMA 2 - con datos de MongoDB
  const isNameRegistered = await Person.exists({ name }); // valida si una persona esta registrada

  if (isNameRegistered) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const validateNumber = /^3\d{9}$/.test(String(number).trim()); // valida que el número comience con 3 y tenga exactamente 10 dígitos, el método test devuelve true si el número cumple con el formato, de lo contrario devuelve false. El método trim se utiliza para eliminar espacios en blanco al inicio y al final del número, asegurando que la validación sea precisa incluso si el usuario ingresa espacios adicionales.

  if (!validateNumber) {
    return res.status(400).json({ error: 'Invalid Colombian mobile format. Use 3115487899 as example' });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000), // Generar un ID aleatorio para la nueva persona, al multiplicarlo por 1000000 se reduce la probabilidad de colisiones, aunque no es una solución perfecta para un sistema de producción, es util para este ejercicio.
    name,
    number
  };

  // FORMA 1 - con datos estáticos
  // persons.push(newPerson); // Agregar la nueva persona al array de personas

  // res.status(201).json({ message: 'Person added successfully', person: newPerson });

  // FORMA 2 - con datos de MongoDB
  const person = new Person(newPerson);
  person.save()
    .then(savedPerson => {
      res.status(201).json({ message: 'Persona agregada exitosamente', person: savedPerson });
    })
    // forma 1 - con datos estáticos
    // .catch(error => {
    //   console.error('Error guardando persona en MongoDB:', error.message);
    //   res.status(500).json({ error: 'Internal server error' });
    // });
    //forma 2 middleware de manejo de errores
    .catch(error => next(error)); // Pasar el error al middleware de manejo de errores

});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});