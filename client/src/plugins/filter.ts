import Vue from 'vue'
import { format } from 'date-fns'

Vue.filter('date', (value: any, formatString: string) => {
  return format(value, formatString)
})
