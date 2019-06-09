import axios from 'axios'
import * as coursesDB from '../store/courses_db'

export function syncHistoricalCourses(userToken, currency) {
  const dbHandle = coursesDB.courses()

  let p = dbHandle.getLastDateSavedCourse(currency).then((lastDate) => {
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
    .then(response => {
      let courses = response.data

      //remove invalid data
      for(let i in courses) {
        if(!courses[i].close) {
          courses[i] = null
        }
      }

      return courses
    })
    .then((courses) => dbHandle.saveHistoricalCourses(currency, courses))

  return p
}

export function syncTickerCourses(userToken, currency) {
  const dbHandle = coursesDB.courses()

  let p = axios.get(`/api/course/${currency.type}/${currency.name}/ticker`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })
    .then(response => {
      let courses = response.data

      //remove invalid data
      for(let i in courses) {
        if(!courses[i].price || !courses[i].price.amount) {
          courses[i] = null
        }
      }

      return courses
    })
    .then((courses) => dbHandle.saveTickerCourses(currency, courses))

  return p
}
