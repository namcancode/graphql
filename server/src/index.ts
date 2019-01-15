import * as Koa from 'koa'
import * as apiRouter from './router/api'
const cors = require('@koa/cors')
import * as session from 'koa-session'
import { SESSION_KEY, MONGO_URI, PORT } from './config'
import * as mongoose from 'mongoose'
import Error from './middleware/Error'
import axios from 'axios'
import * as Raven from 'raven'
import { SENTRY } from '@/config'

Raven.config(SENTRY).install()

mongoose.set('useCreateIndex', true)
mongoose.connect( MONGO_URI, { useNewUrlParser: true })

axios.interceptors.response.use(response => response, error => (process.env.PRODUCTION ? Raven.captureException(error) : Promise.reject(error)))

const app = new Koa()

app.keys = SESSION_KEY

app.use(cors({ credentials: true }))
app.use(session(app))
app.use(Error())
app.use(apiRouter.routes())

app.listen(PORT)

console.log('Server running on port ' + PORT)
