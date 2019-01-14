import airtable = require('airtable')
import { EventEmitter } from 'events'

export default class Airtable {
  private model: AirtableModel

  constructor(options: { apiKey: string; base: string; table: string }) {
    this.model = new airtable({ apiKey: options.apiKey }).base(options.base)(options.table)
  }

  public findByByFormula(formula = '') {
    return this.find({ filterByFormula: formula })
  }

  public all() {
    return this.find()
  }

  public create(data: object) {
    return new Promise((resolve, reject) => {
      this.model.create(data, (err: AirtableError, record: AirtableRecord) => {
        if (err) {
          reject(err)
        }

        resolve(record)
      })
    })
  }

  public update(id: string, data: object) {
    return new Promise((resolve, reject) => {
      this.model.update(id, data, (err, newRecord) => {
        if (err) {
          reject(err)
        }

        resolve(newRecord)
      })
    })
  }

  public find(options: AirtableFilter = {}) {
    const event = new EventEmitter()

    this.model.select(options).eachPage(
      function page(records, fetchNextPage) {
        event.emit('page', records)

        fetchNextPage()
      },
      function done(err) {
        event.emit('done')
        err ? event.emit('error', err) : event.emit('sucess')
      }
    )

    return event
  }
}
