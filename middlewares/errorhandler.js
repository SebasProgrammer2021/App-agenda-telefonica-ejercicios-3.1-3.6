const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  // si el error es un CastError, significa que el ID proporcionado no es válido, por ejemplo, si se intenta buscar una nota con un ID que no tiene el formato correcto de MongoDB (un ObjectId), se lanzará un CastError. En este caso, se responde con un código de estado 400 (Bad Request) y un mensaje de error indicando que el ID de la nota es inválido o mal formado.
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'ID de nota inválido, mal formado' })
  }

  // para otros tipos de errores, se responde con un código de estado 500 (Internal Server Error) y un mensaje de error genérico. Esto cubre cualquier otro error que pueda ocurrir en la aplicación, como errores de conexión a la base de datos, errores de validación, etc.
  next(error)
}

module.exports = errorHandler