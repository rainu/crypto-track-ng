"use strict";

const FiatCourse = require('../../../../../common/db/model/course/fiat');
const request = require('../../../../../common/request_repeater');
const moment = require("moment");
const parse = require('csv-parse/lib/sync');

const MIN_DATE = moment('2009-01-01');

const getFrom = function(from, to, defaultFrom) {
  return new Promise((resolve, reject) => {
    FiatCourse.find({ from: from, to: to })
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
  if(!text) return -1;

  let parsed = parseFloat(text.replace(".", "").replace(",", "."));

  if(!parsed) {
    parsed = null;
  }

  return parsed;
}

const inverseData = function(content) {
  let from = content.from;
  let to = content.to;
  let result = {...content}
  result.to = from;
  result.from = to;
  result.open = 1 / result.open;
  result.high = 1 / result.high;
  result.low = 1 / result.low;
  result.close = 1 / result.close;

  return result;
}

const extractData = function(content) {
  /**
   * EXAMPLE-Record

     { Datum: '2009-01-01',
      Erster: '1,3917',
      Hoch: '1,3917',
      Tief: '1,3917',
      Schlusskurs: '1,3917' }

   */

  return {
    date: moment(content['Datum'], "YYYY-MM-DD").toDate(),
    open: saveParseFloat(content['Erster']),
    high: saveParseFloat(content['Hoch']),
    low: saveParseFloat(content['Tief']),
    close: saveParseFloat(content['Schlusskurs']),
  };
}

const saveEntity = function(content) {
  let where = { from: content.from, to: content.to, date: content.date }
  return FiatCourse.update(where, content, { upsert : true });
}

const fiatUrls = {
  "EUR": {
    "USD": function(from, to){
      let fFrom = moment(from).format('DD.MM.YYYY')
      let fTo = moment(to).format('DD.MM.YYYY')

      return `https://www.ariva.de/quote/historic/historic.csv?secu=4633&boerse_id=48&clean_split=0&clean_payout=0&clean_bezug=0&min_time=${fFrom}&max_time=${fTo}&trenner=%3B&go=Download`
    }
  }
}

const fiatHistorical = function(from = MIN_DATE) {
  return new Promise((resolve, reject) => {

    let requestPromises = [];

    for(let pairFrom of Object.keys(fiatUrls)){
      for(let pairTo of Object.keys(fiatUrls[pairFrom])){

        requestPromises.push(new Promise((reqResolve, reqReject) => {
          getFrom(pairFrom, pairTo, from).then((startDate) => {

            const url = fiatUrls[pairFrom][pairTo](startDate, moment())
            request(url).then(({body}) => {
              let writePromises = []

              let records = parse(body, {
                delimiter: ';',
                auto_parse: true,
                columns: true,
                skip_empty_lines: true
              })

              for (let record of records) {
                let data = {
                  from: pairFrom,
                  to: pairTo,
                  ...extractData(record),
                }
                let iData = inverseData(data)

                writePromises.push(saveEntity(data))
                writePromises.push(saveEntity(iData))
              }

              //wait for all writings
              Promise.all(writePromises).then(reqResolve).catch(reqReject)
            });

          });
        }));
      }
    }

    //wait for all requests
    Promise.all(requestPromises).then(resolve).catch(reject)
  })
}

module.exports = fiatHistorical;

