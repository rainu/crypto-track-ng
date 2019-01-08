import * as balancesDB from '../store/balances_db'
import * as coursesDB from '../store/courses_db'

//we have to wait for our indexdb(localforage) instances to be ready
export default function ({app, store}) {
  return Promise.all([
    balancesDB.balances().ready(),
    coursesDB.courses().ready()
  ])
}
