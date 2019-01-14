import devConfig from './config.dev'
import prodConfig from './config.prod'

const config = process.env.PRODUCTION ? prodConfig : devConfig
const defaultConfig = {
  FE_VERSION: '0.0.1'
}

const CONFIG = Object.assign(defaultConfig, config)

export = CONFIG
