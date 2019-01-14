import axios from 'axios'
import { API_URL } from '@/config'
import { Notification } from 'element-ui'
import { isArray } from 'lodash'

const request = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

request.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (!error.response || error.response.status > 500) {
      error.message = 'Không thể kết nối đến máy chủ'
      Notification.error(error.message)
      return Promise.reject(error)
    }

    if (error.response.status < 500 && isArray(error.response.data)) {
      const listError = <string[]>error.response.data
      listError.forEach(msg => {
        setTimeout(() => Notification.warning(msg), 0)
      })
      return Promise.reject()
    }

    if (error.response.status === 500) {
      Notification.error('Chức năng này đang được bảo trì, chúng tôi sẽ thông báo khi bảo trì hoàn thành')
    }

    return Promise.reject(error)
  }
)

export default request
