"use strict";

const User = require('../../common/db/model/oauth2/user');
const Wallet = require('../../common/db/model/wallet');
const Transaction = require('../../common/db/model/transaction');
const log = require('../../common/log');

/**
 * Import a whole account data.
 *
 * @param accountData
 * @return {Promise<any>}
 */
let doImport = (accountData) => {
  return new Promise((resolve, reject) => {
    reject("Not implemented yet!")
  });
};

/**
 * Export all data related to the given account. This
 * exportdata can also be used for importing the whole
 * account data.
 *
 * @param userId the id of the account to export
 * @return {Promise<any>} the promise where resolve gives you the whole account data
 */
let doExport = (userId) => {
  return new Promise((resolve, reject) => {
    const data = {}

    User.findById(userId).then(user => {
      data.account = {
        username: user.username,
        password: user.password
      }

      //user owned wallets
      Wallet.find({owner: userId}).then(wallets => {
        data.wallets = {}
        let walletMapping = {}

        let i=0;
        for(let wallet of wallets) {
          walletMapping[wallet._id] = i

          data.wallets[`${i++}`] = {
            name: wallet.name,
            address: wallet.address,
            currencies: wallet.currencies,
            description: wallet.description
          }
        }

        //user owned transactions
        Transaction.find({owner: userId}).then(transactions => {
          data.transactions = {}

          let i=0;
          for(let transaction of transactions) {
            data.transactions[`${i++}`] = {
              involvedWallets: transaction.involvedWallets,
              date: transaction.date,
              type: transaction.type,
              data: transaction.data,
            }
          }

          //finally mask internal Ids
          let rawJson = JSON.stringify(data)
          for(let wId of Object.keys(walletMapping)) {
            //maybe a little bit slow (search and replace in json-as-string)
            rawJson = rawJson.replace(new RegExp(`"${wId}"`, "g"), `"${walletMapping[wId]}"`)
          }

          resolve(JSON.parse(rawJson))
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
    }).catch(err => {
      reject(err);
    });
  });
};

module.exports = {
  import: doImport,
  export: doExport
};
