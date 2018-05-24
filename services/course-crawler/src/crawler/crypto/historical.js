"use strict";

const cheerio = require('cheerio');
const request = require('../../../../../common/request_repeater');
const HistoricalCourse = require('../../../../../common/db/model/course/historical');
const moment = require("moment");

const MIN_DATE = moment('2009-01-01');

const getFrom = function(symbol, fiat, defaultFrom) {
  return new Promise((resolve, reject) => {
    HistoricalCourse.find({ symbol: symbol, fiat: fiat })
    .limit(1)
    .sort({ date: 'desc' })
    .select({ date: 1})
    .exec((err, courses) => {
      if (err || courses.length === 0) {
        resolve(defaultFrom);
        return;
      }

      resolve(moment(courses[0].date));
    })
  });
}

const saveParseFloat = function(text){
  let parsed = parseFloat(text);

  if(!parsed) {
    parsed = null;
  }

  return parsed;
}

const parse = function(content) {
  const $ = cheerio.load(content);

  let courses = []
  $('table.table tbody tr').each(function (i, elem) {
    const cells = $(this).find('td');
    const rawDate = cells.eq(0).text();

    const data = {
      date: moment(rawDate, "MMM DD, YYYY").hour(0).minute(0).toDate(),
      fiat: 'USD',
      open: saveParseFloat(cells.eq(1).data('format-value')),
      high: saveParseFloat(cells.eq(2).data('format-value')),
      low: saveParseFloat(cells.eq(3).data('format-value')),
      close: saveParseFloat(cells.eq(4).data('format-value')),
      volume: saveParseFloat(cells.eq(5).data('format-value')),
    };

    courses.push(data);
  });

  return courses;
}

const historical = function(from = MIN_DATE){
  return new Promise((resolve, reject) => {

    //first we need to know which coins ar listed
    request("https://api.coinmarketcap.com/v2/listings/").then(({body}) => {
      let requestPromises = [];
      let jsonBody = JSON.parse(body);

      //now we can crawl each coin
      for(let coin of jsonBody.data) {
        requestPromises.push(new Promise((reqResolve, reqReject) => {
          getFrom(coin.symbol, 'USD', from).then((startDate) => {
            const start = startDate.format('YYYYMMDD');
            const end = moment().add(-1, 'days').format('YYYYMMDD');
            const url = `https://coinmarketcap.com/currencies/${coin.website_slug}/historical-data/?start=${start}&end=${end}`;

            //crawl the coin
            request(url).then(({body}) => {

              let writePromises = []

              for(let curCourse of parse(body)) {
                let dbEntity = {
                  symbol: coin.symbol,
                  ...curCourse,
                };
                let where = { symbol: dbEntity.symbol, fiat: dbEntity.fiat, date: dbEntity.date }
                writePromises.push(HistoricalCourse.update(where, dbEntity, { upsert : true }));
              }

              //wait for all writings
              Promise.all(writePromises).then(reqResolve).catch(reqReject)
            }).catch(reqReject)
          });
        }));

        break;
      }

      //wait for all requests
      Promise.all(requestPromises).then(resolve).catch(reject)
    }).catch(err => reject(err))
  });
};


module.exports = historical;

