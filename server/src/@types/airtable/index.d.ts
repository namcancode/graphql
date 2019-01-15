declare module 'airtable' {
  class airtable {
    constructor(initData: { apiKey: string })

    base(database: string): initTableFunction
  }
  export = airtable
}

interface initTableFunction {
  (table: string): AirtableModel
}

interface AirtableModel {
  select(filter: AirtableFilter): AirtableQuery
  update(id: string, newData: object, onDone: (err: AirtableError, newRecord: AirtableRecord) => void)
  create(data: object, onDone: (err: AirtableError, record: AirtableRecord) => void)
}

interface AirtableQuery {
  firstPage(onDone: (err: AirtableError, records: AirtableRecord[]) => void)
  eachPage(onPageData: (records: AirtableRecord[], fetchNextPage: () => void) => void, onDone: (err: AirtableError) => void)
}

interface AirtableFilter {
  fields?: [string]
  filterByFormula?: string
  maxRecords?: number
  pageSize?: number
  sort?: [
    {
      field?: string
      direction?: 'desc' | 'asc'
    }
  ]
  view?: string
  cellFormat?: 'json' | 'string'
  timeZone?: string
  userLocale?: string
}

interface AirtableError {
  err: string
  message: string
  statusCode: number
}

interface AirtableRecord {
  id: string
  fields: object
  getId(): string
  set(columnName: string): void
  get(columnName: string): any
  putUpdate(newData: object, done?: (err: AirtableError) => void)
  patchUpdate(newData: object, done?: (err: AirtableError) => void)
  save(done?: (err: AirtableError) => void)
}
