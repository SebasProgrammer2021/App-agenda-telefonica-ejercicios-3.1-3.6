# Agenda telefónica — ejercicios 3.1–3.6

Backend de la agenda telefónica con **Express** (Node.js), correspondiente a los ejercicios del curso.

## Entorno local

**Requisitos:** Node.js 18 o superior (recomendado).

```bash
npm install
npm run dev    # desarrollo con nodemon
# o
npm start      # producción local (node index.js)
```

Por defecto el servidor escucha en el puerto **3001** si no existe la variable `PORT`.

## Despliegue en Render

[Render](https://render.com) es una plataforma en la nube para alojar aplicaciones web, APIs y bases de datos. Conecta tu repositorio Git (GitHub, GitLab o Bitbucket), ejecuta el comando de build, arranca el proceso con el comando de inicio y expone un dominio HTTPS.

### URL de producción

**Base:** [https://app-agenda-telefonica-ejercicios-3-1-3-6.onrender.com/](https://app-agenda-telefonica-ejercicios-3-1-3-6.onrender.com/)

Comprueba que el servicio responde en la raíz:

- `GET /` → texto `Hello, World!`

### Configuración típica del Web Service

| Parámetro | Valor |
|-----------|--------|
| Tipo | **Web Service** |
| Runtime | **Node** |
| Build command | `npm install` |
| Start command | `npm start` |

Render define automáticamente la variable de entorno **`PORT`**; la aplicación usa `process.env.PORT` en `index.js`, por lo que no hace falta configurar `PORT` a mano en el panel.

### Flujo de trabajo recomendado

1. Subir el código a un repositorio remoto (rama `main` u otra acordada).
2. En [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service** → conectar el repositorio.
3. Indicar build y start como en la tabla anterior y desplegar.
4. Tras cada `git push` a la rama conectada, Render puede volver a construir y desplegar (según la configuración de despliegue automático).

### Endpoints útiles en producción

Sustituye la base por la URL de arriba.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Comprobación rápida del servicio |
| GET | `/api/persons` | Lista todas las personas |
| GET | `/info` | Información HTML: cantidad de registros y fecha |
| GET | `/api/persons/:id` | Una persona por `id` numérico |
| DELETE | `/api/persons/:id` | Elimina una persona |
| POST | `/api/persons` | Crea una persona (JSON: `name`, `number`) |

**Ejemplo (lista):**

```text
GET https://app-agenda-telefonica-ejercicios-3-1-3-6.onrender.com/api/persons
```

**Ejemplo (crear persona):**

```bash
curl -X POST https://app-agenda-telefonica-ejercicios-3-1-3-6.onrender.com/api/persons \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Prueba\",\"number\":\"3115487899\"}"
```

La validación del número exige formato de móvil colombiano: 10 dígitos que empiezan por `3` (por ejemplo `3115487899`).

### Limitaciones a tener en cuenta

- **Plan gratuito:** el servicio puede entrar en reposo tras un tiempo sin tráfico; el primer request tras el reposo puede tardar varios segundos (cold start).
- **Datos en memoria:** las personas se guardan en un array en memoria (`data.js` + mutaciones en tiempo de ejecución). Un **reinicio del servicio** o un **nuevo despliegue** restablece el estado al cargar el proceso; los cambios no persisten como en una base de datos.
- **Logs:** en el panel de Render → tu servicio → **Logs** puedes ver la salida de la aplicación (incluido Morgan para las peticiones HTTP).

### Documentación oficial

- [Render — documentación](https://render.com/docs)
- [Desplegar un servicio web Node](https://render.com/docs/deploy-node-express-app) (patrón similar: `npm install` + `npm start`)

## Licencia

ISC (ver `package.json`).
