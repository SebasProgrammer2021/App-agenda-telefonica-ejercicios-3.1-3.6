const express = require('express');
const { persons } = require('./data');
const app = express();
const morgan = require('morgan');
const PORT = process.env.PORT || 3001

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
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// ejercicio 3.2
app.get('/info', (req, res) => {
  const totalPersons = persons.length;
  const currentDate = new Date();
  res.send(`Phonebook has info for ${totalPersons} people<br>${currentDate}`);
});

// ejercicio 3.3
app.get('/api/persons/:id', (req, res) => {
  const personId = Number(req.params.id);
  const targetPerson = persons.find(person => person.id === personId);

  if (!targetPerson) {
    return res.status(404).json({ error: 'Person not found' });
  }

  res.json(targetPerson);
});

// ejercicio 3.4
app.delete('/api/persons/:id', (req, res) => {
  const personId = Number(req.params.id);
  const index = persons.findIndex(person => person.id === personId); // Encontrar el índice de la persona a eliminar, findIndex devuelve -1 si no encuentra el elemento

  if (index === -1) {
    return res.status(404).json({ error: 'Person not found' });
  }

  persons.splice(index, 1); // splice elimina el elemento del array en el índice encontrado, el segundo argumento indica cuántos elementos eliminar (en este caso, solo uno)
  res.status(204).end();
});

// ejercicio 3.5 
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' });
  }

  // validar si el nombre ya existe
  const isNameRegistered = persons.some(person => person.name === name); // some devuelve true si al menos un elemento del array cumple con la condición, en este caso, si el nombre ya existe en el array de personas

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

  persons.push(newPerson); // Agregar la nueva persona al array de personas

  res.status(201).json({ message: 'Person added successfully', person: newPerson });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});