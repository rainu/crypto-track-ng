const migrations = [
  require('./migration/0.js'),
  require('./migration/1.js')
];

const CURRENT_VERSION = migrations.length - 1;

const startMigration = function(data) {
  let version = data.version || 0;

  let promise = Promise.resolve(data);

  //go step by step through all migrations starts with
  //the given version
  for(let i=version; i <= CURRENT_VERSION; i++) {
    //add the current migration to out promise-chain
    promise = promise.then(migrations[i])
  }

  return promise;
}

module.exports = {
  startMigration,
  CURRENT_VERSION
};
