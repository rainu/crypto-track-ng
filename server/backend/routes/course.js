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

router.route('/api/course/:type/:symbol')

  //get the course of the given currency
  .get((req, resp) => {

    HistoricalCourse.find({$or: [
      {from: { name: req.params.symbol, type: req.params.type } },
      {to: { name: req.params.symbol, type: req.params.type } }
    ]})
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

    TickerCourse.find({$or: [
      {currency: { name: req.params.symbol, type: req.params.type }},
      {"price.currency": { name: req.params.symbol, type: req.params.type }},
    ]})
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
