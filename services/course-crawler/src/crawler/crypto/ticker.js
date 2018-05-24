"use strict";

const request = require('../../../../../common/request_repeater');
const config = require('../../../../../common/config');
const TickerCourse = require('../../../../../common/db/model/course/ticker');

const extractData = function(data){
  let fiat = Object.keys(data.quotes)[0];

  return {
    symbol: data.symbol,
    rank: data.rank,
    price: data.quotes[fiat].price,
    fiat: fiat,
    change: {
      hour: data.quotes[fiat]['percent_change_1h'],
      day: data.quotes[fiat]['percent_change_24h'],
      week: data.quotes[fiat]['percent_change_7d'],
    }
  }
}

const ticker = function(){
  return new Promise((resolve, reject) => {
    const max = config.crawler.ticker.crypto.max;

    let requestPromises = [];
    let writePromises = []

    for(let offset=1; offset < max; offset += 100) {

      requestPromises.push(new Promise((reqResolve, reqReject) => {
        request(`https://api.coinmarketcap.com/v2/ticker/?start=${offset}&limit=100&sort=id&structure=array`).then(({body}) => {
          let jsonBody = JSON.parse(body);

          if(jsonBody.data) for(let coin of jsonBody.data){
            let dbEntity = extractData(coin);
            let where = { symbol: dbEntity.symbol, fiat: dbEntity.fiat }
            writePromises.push(TickerCourse.update(where, dbEntity, { upsert : true }));
          }

          reqResolve();
        }).catch(reqReject)
      }));

    }

    //first wait for all requests
    Promise.all(requestPromises).then(() => {
      //after that wait for all writings
      Promise.all(writePromises).then(resolve).catch(reject)
    }).catch((err) => {

      //after that wait for all writings
      Promise.all(writePromises).then(() => {
        reject(err)
      }).catch(reject)
    })
  })
};


module.exports = ticker;

