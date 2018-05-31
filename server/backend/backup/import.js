"use strict";

const AccessToken = require('../../../common/db/model/oauth2/access_token')
const RefreshToken = require('../../../common/db/model/oauth2/refresh_token')
const User = require('../../../common/db/model/oauth2/user');
const Wallet = require('../../../common/db/model/wallet');
const Transaction = require('../../../common/db/model/transaction');
const log = require('../../../common/log');
const { startMigration, CURRENT_VERSION } = require('./migration');

/**
 * Import a whole account data.
 *
 * @param accountData
 * @return {Promise<any>}
 */
let doImport = (accountData) => {
  return startMigration(accountData)
    .then((migratedAccountData) => {
      return new Promise((resolve, reject) => {

        //first of all we have to delete the complete user
        User.findOne({username: migratedAccountData.account.username}).then(user => {
          let dbPromises = []

          dbPromises.push(AccessToken.remove({User: user._id}))
          dbPromises.push(RefreshToken.remove({User: user._id}))
          dbPromises.push(Wallet.remove({owner: user._id}))
          dbPromises.push(Transaction.remove({owner: user._id}))
          dbPromises.push(User.findByIdAndRemove(user._id))

          //then we can import the uploaded data
          Promise.all(dbPromises).then(() => {
            let dbPromises = []

            //user
            let newUser = new User({
              username: migratedAccountData.account.username,
              password: migratedAccountData.account.password,
            });
            dbPromises.push(newUser.save())

            //wallets
            let walletMapping = {}
            for(let walletKey of Object.keys(migratedAccountData.wallets)) {
              let wallet = migratedAccountData.wallets[walletKey];
              let newWallet = new Wallet({
                owner: newUser._id,
                name: wallet.name,
                address: wallet.address,
                currencies: wallet.currencies,
                description: wallet.description
              })
              dbPromises.push(newWallet.save());

              walletMapping[walletKey] = newWallet._id;
            }

            //unmask internal Ids
            let transactionsDraft = migratedAccountData.transactions
            let jsonTransactionsDraft = JSON.stringify(transactionsDraft)

            for(let maskedKey of Object.keys(walletMapping)){
              let dbKey = walletMapping[maskedKey]

              //maybe a little bit slow (search and replace in json-as-string)
              jsonTransactionsDraft = jsonTransactionsDraft.replace(new RegExp(`"${maskedKey}"`, "g"), `"${dbKey}"`)
            }
            transactionsDraft = JSON.parse(jsonTransactionsDraft)

            //transactions
            for(let transactionKey of Object.keys(transactionsDraft)) {
              let transaction = transactionsDraft[transactionKey];
              let newTransaction = new Transaction({
                owner: newUser._id,
                involvedWallets: transaction.involvedWallets,
                involvedCurrencies: transaction.involvedCurrencies,
                date: transaction.date,
                type: transaction.type,
                data: transaction.data,
              })
              dbPromises.push(newTransaction.save())
            }

            Promise.all(dbPromises).then(() => {
              resolve()
            }).catch(err => {
              reject(err)
            })
          }).catch(err => {
            reject(err)
          })
        }).catch(err => {
          reject(err)
        })
      });
    })
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
    const data = {
      version: CURRENT_VERSION,
    }

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
          walletMapping[wallet._id] = `_wallet_${i}`

          data.wallets[`_wallet_${i++}`] = {
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
            data.transactions[`_transaction_${i++}`] = {
              involvedWallets: transaction.involvedWallets,
              involvedCurrencies: transaction.involvedCurrencies,
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
