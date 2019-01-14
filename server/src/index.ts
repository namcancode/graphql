import { ApolloServer } from 'apollo-server-koa'
import { optionSever } from '@/module/graphql'
import { MONGO_URI, PORT, SESSION_KEY } from '@/config'
import * as mongoose from 'mongoose'
import * as Koa from 'koa'
import * as session from 'koa-session'
const cors = require('@koa/cors')
import axios from 'axios'
import * as Raven from 'raven'
import { SENTRY } from '@/config'

Raven.config(SENTRY).install()

mongoose.set('useCreateIndex', true)
mongoose.connect(MONGO_URI,{ useNewUrlParser: true })

axios.interceptors.response.use(response => response, error => (process.env.PRODUCTION ? Raven.captureException(error) : Promise.reject(error)))

const server = new ApolloServer({ ...optionSever })

const app = new Koa()
app.keys = SESSION_KEY
app.use(session(app))
app.use(cors({ credentials: true }))

server.applyMiddleware({ app })

app.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at port ${PORT}, ${server.graphqlPath}`)
})
