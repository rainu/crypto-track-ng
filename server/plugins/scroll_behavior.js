/**
 * This function defines the scroll behavior.
 *
 * @param to to which page was navigating
 * @param from the page where i was before
 * @param savedPosition
 * @returns {{x: number, y: number}}
 */

let scrollBehavior = function(to, from, savedPosition) {
  //little structure for easy define where i should scroll at the buttom
  const atBottom = {
    "lang-user-username-transaction-new": "lang-user-username-transaction",
    "lang-user-username-wallet-new": "lang-user-username-wallet",
  }

  if(atBottom[from.name] === to.name){
    return { x: 0, y: 1000000 }
  }


  return { x: 0, y: 0 }
}

module.exports = scrollBehavior;
