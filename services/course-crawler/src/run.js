const mongodb = require('../../../common/db/setup');
const log = require('../../../common/log');
const config = require('../../../common/config');
const historical = require('./crawler/crypto/historical');
const ticker = require('./crawler/crypto/ticker');
const fiatHistorical = require('./crawler/fiat/historical');

const historicalCryptoJob = () => {
  log.info("Update historical crypto courses...");

  historical().then(() => {
    log.info("Update historical crypto courses ... done!");
    setTimeout(historicalCryptoJob, config.crawler.historical.crypto.interval);
  }, err => {
    log.error('Error while requesting historical crypto courses.', err);
    setTimeout(historicalCryptoJob, config.crawler.historical.crypto.interval);
  });
};

const historicalFiatJob = () => {
  log.info("Update historical fiat courses...");

  fiatHistorical().then(() => {
    log.info("Update historical fiat courses ... done!");
    setTimeout(historicalFiatJob, config.crawler.historical.fiat.interval);
  }, err => {
    log.error('Error while requesting historical fiat courses.', err);
    setTimeout(historicalFiatJob, config.crawler.historical.fiat.interval);
  });
};

const tickerCryptoJob = () => {
  log.info("Update ticker crypto courses...");

  ticker().then(() => {
    log.info("Update ticker crypto courses ... done!");
    setTimeout(tickerCryptoJob, config.crawler.ticker.crypto.interval);
  }, err => {
    log.error('Error while requesting ticker crypto courses.', err);
    setTimeout(tickerCryptoJob, config.crawler.ticker.crypto.interval);
  });
};

historicalCryptoJob();
historicalFiatJob();
tickerCryptoJob();
