import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { FANPAGE_TOKEN } from '@/config'

class Facebook {
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

export default async function getUidFromFacebook(fbLink: string) {
  if (!fbLink) return
  const facebook = new Facebook(FANPAGE_TOKEN)
  const regex = /profile\.php\?id=(\d+)/.exec(fbLink)
  const link = fbLink.match(/https?\:\/\/(?:www\.)?facebook\.com\/(\d+|[A-Za-z0-9\.]+)\/?/) || ''
  const username = regex ? regex[1] : link[1]

  if (!username) return ''
  const rs: any = await facebook.graph(username + '?fields=id')

  return rs.data.id || ''
}
