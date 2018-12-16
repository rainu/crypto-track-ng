import axios from 'axios'
import * as coursesDB from '../store/courses_db'

export function syncHistoricalCourses(userToken, currency) {
  const dbHandle = coursesDB.courses()

  let p = dbHandle.getLastDateSavedCourse(currency)
    .then((lastDate) => {
      let query = ""
      if(lastDate) {
        query = `?from=${lastDate}`
      }

      return axios.get(`/api/course/${currency.type}/${currency.name}/historical${query}`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
    })
    .then((response) => dbHandle.saveHistoricalCourses(currency, response.data))

  return p
}

export function syncTickerCourses(userToken, currency) {
  const dbHandle = coursesDB.courses()

  let p = axios.get(`/api/course/${currency.type}/${currency.name}/ticker`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })
    .then((response) => dbHandle.saveTickerCourses(currency, response.data))

  return p
}
