const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const log = require('../../../common/log');

const HistoricalCourse = require('../../../common/db/model/course/historical');
const FiatHistoricalCourse = require('../../../common/db/model/course/fiat');

router.route('/api/course/crypto/:symbol')

  //get the course of the given currency
  .get((req, resp) => {

    HistoricalCourse.find({symbol: req.params.symbol})
    .then(resp.send)
    .catch(err => {
      log.error("An error occurred while request fiat courses!", err)

      resp.status(HttpStatus.NOT_FOUND);
      resp.end();
    })
  })

router.route('/api/course/fiat/:symbol')

  //get the course of the given currency
  .get((req, resp) => {

    FiatHistoricalCourse.find({$or: [
      {from: req.params.symbol},
      {to: req.params.symbol}
    ]})
    .then(resp.send)
    .catch(err => {
      log.error("An error occurred while request fiat courses!", err)

      resp.status(HttpStatus.NOT_FOUND);
      resp.end();
    })

  })

module.exports = router
