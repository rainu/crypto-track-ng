//from 0 to 1

/* OLD

{
  "account": {
    "username": "",
    "password": ""
  },
  "wallets": {
    "_wallet_0": {
      "name": "",
      "address": "",
      "currencies": [
        {
          "name": "",
          "type": ""
        }
      ],
      "description": ""
    },
    ...
  },
  "transactions": {
    "_transaction_0": {
      "involvedWallets": [
        "_wallet_0"
      ],
      "date": "2015-03-17T20:00:00.420Z",
      "type": "giftIn",
      "data": {
        "in": {
          "amount": ,
          "currency": {
            "name": "",
            "type": ""
          },
          "wallet": ""
        },
        "fee": [],
        "details": {
          "exchange": "",
          "group": "",
          "comment": ""
        }
      }
    },
    ...
  }
}

 */
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/* NEW
  * a new property foreach transactions: involvedCurrencies

{
  "account": {
    "username": "",
    "password": ""
  },
  "wallets": {
    "_wallet_0": {
      "name": "",
      "address": "",
      "currencies": [
        {
          "name": "",
          "type": ""
        }
      ],
      "description": ""
    },
    ...
  },
  "transactions": {
    "_transaction_0": {
      "involvedWallets": [
        "_wallet_0"
      ],
      "involvedCurrencies": [
        "currency": {
          "name": "",
          "type": ""
        },
        ...
      ]
      "date": "2015-03-17T20:00:00.420Z",
      "type": "giftIn",
      "data": {
        "in": {
          "amount": ,
          "currency": {
            "name": "",
            "type": ""
          },
          "wallet": ""
        },
        "fee": [],
        "details": {
          "exchange": "",
          "group": "",
          "comment": ""
        }
      }
    },
    ...
  }
}
 */

const currencyId = function(currency) {
  return `${currency.type}_${currency.name}`
}

const uniq = function(currencies) {
  let uniq = []
  const alreadyKnown = new Set();

  for(let currency of currencies) {
    //skip empty currencies
    if(!currency) continue;
    if(!currency.name) continue;
    if(!currency.type) continue;

    let id = currencyId(currency);

    if(!alreadyKnown.has(id)){
      uniq.push(currency);
      alreadyKnown.add(id);
    }
  }

  return uniq
}

module.exports = function(data){
  return new Promise((resolve, reject) => {
    console.log("Start migration #1")
    const newData = JSON.parse(JSON.stringify(data))

    for(let curTxId of Object.keys(newData.transactions)){
      let curTx = newData.transactions[curTxId];
      let txType = curTx.type.toLowerCase();
      let currencies = []

      switch(txType) {
        case "exchange":
        case "giftout":
        case "donation":
        case "lost":
        case "spent":
        case "stolen":
          currencies.push(curTx.data.out.currency);
      }
      switch(txType) {
        case "exchange":
        case "giftin":
        case "income":
          currencies.push(curTx.data.in.currency);
      }
      if(txType === 'transfer'){
        currencies.push(curTx.data.currency)
      }

      switch(txType) {
        case "exchange":
        case "giftout":
        case "giftin":
        case "donation":
        case "spent":
        case "income":
          for(let fee of curTx.data.fee) {
            currencies.push(fee.currency);
          }
      }

      curTx.involvedCurrencies = uniq(currencies)
    }

    resolve(newData)
  })
}
