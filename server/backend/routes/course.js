const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const log = require('../../../common/log');

const HistoricalCourse = require('../../../common/db/model/course/historical');
const TickerCourse = require('../../../common/db/model/course/ticker');

function transform(course) {
  let t = {
    ...course._doc
  }

  delete t['_id']
  delete t['__v']

  return t;
}

router.route('/api/course/:type/:symbol/historical')

  //get the course of the given currency
  .get((req, resp) => {

    const type = req.params.type
    const symbol = req.params.symbol
    const from = req.query.from

    let searchQuery = {
      $or: [
        { $and: [ {'from.name': symbol}, {'from.type': type}] },
        { $and: [ {'to.name': symbol}, {'to.type': type}] }
      ]
    }

    if(from) {
      searchQuery.$or[0].$and.push({ date: { $gt: new Date(from) } })
      searchQuery.$or[1].$and.push({ date: { $gt: new Date(from) } })
    }

    HistoricalCourse.find(searchQuery)
    .then((courses) => {
      resp.send(courses.map(transform))
    })
    .catch(err => {
      log.error("An error occurred while request crypto historicalCourses!", err)

      resp.status(HttpStatus.NOT_FOUND);
      resp.end();
    })
  })

router.route('/api/course/:type/:symbol/ticker')

  //get the course of the given currency
  .get((req, resp) => {

    const type = req.params.type
    const symbol = req.params.symbol

    TickerCourse.find({
      $or: [
        { $and: [ {'currency.name': symbol}, {'currency.type': type}] },
        { $and: [ {'price.currency.name': symbol}, {'price.currency.type': type}] }
      ]
    })
    .then((courses) => {
      resp.send(courses.map(transform))
    })
    .catch(err => {
      log.error("An error occurred while request tickerCourses!", err)

      resp.status(HttpStatus.NOT_FOUND);
      resp.end();
    })

  })

module.exports = router
