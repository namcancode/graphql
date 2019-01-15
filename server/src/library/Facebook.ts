import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

export default class Facebook {
  private request: AxiosInstance

  constructor(access_token: string, version = 'v1.0') {
    this.request = axios.create({
      baseURL: `https://graph.facebook.com/${version}`,
      params: { access_token }
    })
  }

  graph(url: string, config?: AxiosRequestConfig) {
    return this.request(url, config)
  }
}
