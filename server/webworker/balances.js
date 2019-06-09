import * as balancesDB from '../store/balances_db'
import * as coursesDB from '../store/courses_db'
import {addToBalance, calculateBalances} from '../functions/balances'
import moment from "moment";

const DEFAULT_MAX_DEPTH = Number.MAX_VALUE

/**
 *
 * @param tradingPairs a list of trading pairs:
 * [{
 *  "from": {
 *    "name": "BTC",
 *    "type": "crypto"
 *  },
 *  "to": {
 *    "name": "EUR",
 *    "type": "fiat"
 *  }
 * }]
 * @param source the source currency
 * {
 *   "name": "BTC",
 *   "type": "crypto"
 * }
 * @param destination the destination currency
 * {
 *   "name": "EUR",
 *   "type": "fiat"
 * }
 * @param maxDepth the maximal depth to go in
 * @param currentDepth the current depth (only for recursive purposes)
 *
 * @return Array with a array of list of nodes (trading pairs)
 * [
 *  [{
 *    "from": {
 *      "name": "BTC",
 *      "type": "crypto"
 *    },
 *    "to": {
 *      "name": "EUR",
 *      "type": "fiat"
 *    }
 *   }]
 * ]
 */
const find = function(tradingPairs, source, destination, maxDepth = DEFAULT_MAX_DEPTH, currentDepth = 0){
  let result = []

  if(currentDepth >= maxDepth) {
    return result;
  }

  let possible = tradingPairs.filter(tp => {
    if(tp.from.name === source.name && tp.from.type === source.type) {
      if(tp.to.name === destination.name && tp.to.type === destination.type) {
        return true;
      }
    }

    return false;
  })

  if(possible.length !== 0) {
    result.push(...possible.map(tp => [tp]));
  }

  //try to route
  let possibleStarts = tradingPairs.filter(tp => {
    if(tp.from.name === source.name && tp.from.type === source.type) {
      return true;
    }

    return false;
  })

  //go through all possible starts
  //and try to find the target
  for(let start of possibleStarts) {
    let tmpSrc = start.to
    let purgedPairs = tradingPairs.filter(tp => {
      if(tp.to.name === tmpSrc.name && tp.to.type === tmpSrc.type) {
        return false;
      }

      return true;
    })

    //recursion ahead!
    let paths = find(purgedPairs, tmpSrc, destination, maxDepth, currentDepth + 1)

    for(let curPath of paths) {
      result.push([start, ...curPath])
    }
  }

  //sort by path length
  return result.sort((pathA, pathB) => {
    if(pathA.length > pathB.length) {
      return 1
    }
    if(pathA.length < pathB.length) {
      return -1
    }
    return 0
  })
}

export function calcTickerBalance(amount, srcCurrency, dstCurrency) {
  let dbHandle = coursesDB.courses()

  return dbHandle.getPairs().then(pairs => {
    const paths = find(pairs, srcCurrency, dstCurrency)

    if(!paths || paths.length <= 0) {
      //no path found!
      return -1;
    }

    const path = paths[0]; //the shortest path
    let ratioPromises = []

    //enrich path with ratios
    for(let hop of path) {
      let p = dbHandle.getTickerCourse(hop.from, hop.to)
      .then((course) => {
        hop.ratio = course
      })
      ratioPromises.push(p);
    }

    let p = Promise.all(ratioPromises)
    .then(() => {
      //now all path hops contains ratios
      let result = amount
      for(let hop of path) {
        result *= hop.ratio
      }
      return result
    })

    return p
  })
}

const extractBalances = (transactions) => {
  let walletIds = {}

  for(let tx of transactions) {
    for(let wallet of tx.involvedWallets){
      walletIds[wallet] = true
    }
  }
  walletIds = Object.keys(walletIds)

  let balances = []
  for(let walletId of walletIds) {
    let wallet = {
      id: walletId
    }

    for(let curBalance of calculateBalances(wallet, transactions)) {
      addToBalance(balances, curBalance.currency, curBalance.amount)
    }
  }

  return balances
}

const _calcHistoricalBalance = (dbHandle, pairs, amount, srcCurrency, dstCurrency, date) => {
  const paths = find(pairs, srcCurrency, dstCurrency)

  if(!paths || paths.length <= 0) {
    //no path found!
    return Promise.resolve(-1);
  }

  const shortestPath = paths[0]; //the shortest path
  let ratioPromises = []

  //enrich path with ratios
  for(let i in shortestPath) {
    const hop = shortestPath[i]
    ratioPromises.push(dbHandle.getHistoricalCourse(hop.from, hop.to, date));
  }

  return Promise.all(ratioPromises)
    .then((courses) => {
      let result = amount
      for(let course of courses) {
        result *= (course ? course.close : 0)
      }
      return result
    })
}

const _calcTotalBalanceAt = (courseHandle, balances, pairs, date, dstCurrency) => {
  let amount = 0;
  let allPromises = []
  for(let balance of balances) {
    let currency = balance.currency
    if(currency.type !== dstCurrency.type || currency.name !== dstCurrency.name) {
      let p = _calcHistoricalBalance(courseHandle, pairs, balance.amount, currency, dstCurrency, date)
        .then((curAmount) => {
          amount += curAmount
        })
      allPromises.push(p)
    }
  }

  return Promise.all(allPromises)
    .then(() => {
      return amount
    })
}

const _calcHistoricalBalances = (balanceHandle, courseHandle, transactions, pairs, dstCurrency, from, until) => {
  from = moment(from).startOf('day')
  until = moment(until).startOf('day')

  let p = []
  for (let curDate = from; curDate.isSameOrBefore(until); curDate = curDate.clone().add(1, 'days')) {
    let filteredTransactions = []
    for (let tx of transactions) {
      if (moment(tx.date).startOf('day').isSameOrBefore(curDate)) {
        filteredTransactions.push(tx);
      } else {
        //transactions are ordered by date
        break;
      }
    }

    let balances = extractBalances(filteredTransactions)
    p.push(balanceHandle.saveBalancesAt(balances, curDate))

    let totalPromise = _calcTotalBalanceAt(courseHandle, balances, pairs, curDate, dstCurrency)
      .then((amount) => {
        balanceHandle.saveTotalAmountAt(amount, dstCurrency, curDate)
      })
    p.push(totalPromise)
  }

  return Promise.all(p)
}

export function calcHistoricalBalances(transactions, dstCurrency, from, until) {
  if(!transactions || transactions.length <= 0) return;

  const dbBalanceHandle = balancesDB.balances()
  const dbCourseHandle = coursesDB.courses()

  transactions = [...transactions]
  transactions.sort((a, b) => {
    return moment(a.date).diff(moment(b.date))
  })

  return Promise.all([
    dbBalanceHandle.getBalanceDates(),
    dbCourseHandle.getPairs()
  ]).then(data => {
    const dates = data[0];
    const pairs = data[1];
    let lFrom = from;
    let lUntil = until;

    if(!lFrom) lFrom = dates && dates.length > 0 ? moment(dates[dates.length - 1]).add(1, 'days') : null
    if(!lFrom) lFrom = transactions[0].date

    if(!lUntil) lUntil = moment()

    lFrom = moment(lFrom)
    lUntil = moment(lUntil)

    if(lFrom.isAfter(lUntil)) {
      //nothing todo
      return Promise.resolve()
    }

    return _calcHistoricalBalances(dbBalanceHandle, dbCourseHandle, transactions, pairs, dstCurrency, lFrom, lUntil)
  })
}
