import axios from 'axios'
import * as Raven from 'raven'
import { SENTRY } from '@/config'

Raven.config(SENTRY).install()

const request = axios.create()

request.interceptors.response.use(
  response => response,
  error => {
    process.env.PRODUCTION ? Raven.captureException(error) : console.log(error)
    return
  }
)
export default request
