const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://sebastianl_db_user:${password}@cluster0.crexpey.mongodb.net/telephoneAgenda?appName=Cluster0`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const run = async () => {
  try {
    await mongoose.connect(url, { family: 4 })

    // Si solo se proporciona hasta la contraseña, se listarán todas las personas en la agenda telefónica.
    if (process.argv.length === 3) {
      const persons = await Person.find({})
      console.log('phonebook:')
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })
      return
    }

    // Si se proporcionan el nombre y el número, se agregará una nueva persona a la agenda telefónica con esos datos.
    if (process.argv.length === 5) {
      const person = new Person({ name, number })
      await person.save()
      console.log(`added ${name} number ${number} to phonebook`)
      return
    }

    console.log('Usage: node mongo.js <password> person [name] person [number]')
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await mongoose.connection.close()
  }
}

run()