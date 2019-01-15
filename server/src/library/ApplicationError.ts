export default class ApplicationError {
  code: string
  status: number
  listMessage: string[] = []

  constructor(message?: string, status = 403, code = 'ERR_APPLICATION') {
    this.code = code
    this.status = status
    if (message) {
      this.message = message
    }
  }

  push(message: string) {
    this.listMessage.push(message)
  }

  get message() {
    return this.listMessage.join('\r')
  }

  set message(value) {
    this.listMessage.push(value)
  }
}
