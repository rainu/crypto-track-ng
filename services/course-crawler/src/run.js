/**
 * Module dependencies.
 */

const log = require('../../../common/log');
const config = require('../../../common/config');
const mongodb = require('../../../common/db/setup');

const updateDailyCourse = require('./ticker');
const updateHistoricalCourse = require('./historical');

const dailyTick = 1000 * 60 * 10; //10min
const historicalTick = 1000 * 60 * 60 * 6; //6h

const dailyJob = () => {
  log.info("Update courses...");

  updateDailyCourse().then(() => {
    log.info("Update courses ... done!");
    setTimeout(dailyJob, dailyTick);
  }, err => {
    log.error('Error while requesting courses.', err);
    setTimeout(dailyJob, dailyTick);
  });
};

const historicalJob = () => {
  log.info("Update historical courses...");

  updateHistoricalCourse().then(() => {
    log.info("Update historical courses ... done!");
    setTimeout(historicalJob, historicalTick);
  }, err => {
    log.error('Error while requesting historical courses.', err);
    setTimeout(historicalJob, historicalTick);
  });
};

dailyJob();
historicalJob();
