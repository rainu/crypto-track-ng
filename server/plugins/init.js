//init stuff here

export default function ({app, store}) {
  //first we have init auth (and wait for them)
  //after that we can init wallet and transactions parallel (without waiting)
  //  after we load the transactions we can load the needed course-data

  let authInit = store.dispatch('auth/init');

  return authInit.then(() => {
    store.dispatch('wallet/init')
    store.dispatch('transaction/init')
      .then(() => store.dispatch('course/init'))
    }
  )
}
