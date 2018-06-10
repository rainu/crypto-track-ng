"use strict";

const request = require('../../../../../common/request_repeater');
const config = require('../../../../../common/config');
const log = require('../../../../../common/log');
const TickerCourse = require('../../../../../common/db/model/course/ticker');

const saveCourses = function(courses){
  if(!courses || courses.length === 0) {
    return Promise.resolve()
  }

  let bulk = TickerCourse.collection.initializeUnorderedBulkOp();
  for(let curCourse of courses) {
    let where = {
      currency: curCourse.currency,
      "price.currency": curCourse.price.currency
    }

    //add bulk operation
    bulk.find(where).upsert().updateOne(curCourse);
  }

  //return a promise of db-execute
  return bulk.execute()
}

const extractData = function(data){
  let fiat = Object.keys(data.quotes)[0];

  return {
    currency: {
      name: data.symbol,
      type: 'crypto'
    },
    rank: data.rank,
    price: {
      amount: data.quotes[fiat].price,
      currency: {
        name: fiat,
        type: 'fiat'
      },
    },
    change: {
      hour: data.quotes[fiat]['percent_change_1h'],
      day: data.quotes[fiat]['percent_change_24h'],
      week: data.quotes[fiat]['percent_change_7d'],
    }
  }
}

const parsePage = function(body) {
  let jsonBody = JSON.parse(body);

  if(jsonBody.data) {
    return jsonBody.data.map(extractData)
  }

  return []
}

const processPage = function(offset){
  return request(`https://api.coinmarketcap.com/v2/ticker/?start=${offset}&limit=100&sort=id&structure=array`)
    .then(({body}) => parsePage(body))
    .then(saveCourses)
    .catch(err => log.error(`[DONE] Ticker of crypto coins with error`, err))
}

const crawl = function(){
  const max = config.crawler.ticker.crypto.max;
  let p = []

  for(let offset=1; offset < max; offset += 100) {
    p.push(processPage(offset))
  }

  return Promise.all(p)
}

module.exports = crawl;

