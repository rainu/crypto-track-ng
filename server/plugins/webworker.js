import Vue from 'vue'
import BalanceWorker from 'workerize-loader!../webworker/balances'
import CourseSyncWorker from 'workerize-loader!../webworker/courseSync'

const balanceWorker = new BalanceWorker
const courseWorker = new CourseSyncWorker

const $webworker = {
  courseSync: courseWorker,
  balance: balanceWorker
}

Vue.prototype.$webworker = $webworker

export default function ({app, store}, inject) {
  app.$webworker = $webworker
  store.$webworker = $webworker
}
