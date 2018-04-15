const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const log = require('../../../common/log');

const Wallet = require('../../../common/db/model/wallet');

function transform(dbWallet){
  let t = {
    id: dbWallet._id,
    href: '/api/wallet/' + dbWallet._id,
    wallet: {
      ...dbWallet._doc,
    }
  }
  delete t.wallet['_id']
  delete t.wallet['owner']
  delete t.wallet['__v']

  return t;
}

//get the wallets of the current user
router.route('/api/wallets').get((req, resp) => {
  Wallet.find({owner: req.token.user._id}).then(wallets => {
    resp.send(wallets.map(w => transform(w)));
  }).catch(err => {
    log.error("An error occurred while request user wallets!", err)

    resp.status(HttpStatus.NOT_FOUND);
    resp.end();
  })
});

//create a new wallet for the user
router.route('/api/wallet').post((req, resp) => {
  let wallet = new Wallet({
    owner: req.token.user._id,
    ...req.body
  });

  wallet.save().then(() => {
    resp.location('/api/wallet/' + wallet._id);
    resp.status(HttpStatus.CREATED);
    resp.send(transform(wallet))
  }).catch(err => {
    log.error("An error occurred while create a new user wallet!", err)

    resp.status(HttpStatus.CONFLICT);
    resp.end();
  })
})

router.route('/api/wallet/:id')
  //gets a given wallet
  .get((req, resp) => {
    Wallet.findOne({
      _id: req.params.id,
      owner: req.token.user._id,  //make sure that no user can get foreign wallets!
    }).then(wallet => {
      if(wallet) {
        resp.send(transform(wallet));
      }else{
        resp.status(HttpStatus.NOT_FOUND);
        resp.end();
      }
    }).catch(err => {
      log.error("An error occurred while getting a user wallet!", err)

      resp.status(HttpStatus.NOT_FOUND);
      resp.end();
    })
  })

  //edit a given wallet
  .put((req, resp) => {
    Wallet.findByIdAndUpdate(req.params.id, {
      owner: req.token.user._id,
      ...req.body
    }).then(wallet => {
      resp.location('/api/wallet/' + req.params.id);
      resp.status(HttpStatus.CREATED);

      Wallet.findById(req.params.id).then(wallet => {
        resp.send(transform(wallet))
      }).catch(err => {
        log.error("An error occurred while getting a user wallet!", err)

        resp.send(transform(wallet))
      })
    }).catch(err => {
      log.error("An error occurred while editing a user wallet!", err)

      resp.status(HttpStatus.CONFLICT);
      resp.end();
    })
  })

  //delete a given wallet
  .delete((req, resp) => {
    Wallet.findOneAndRemove({
      _id: req.params.id,
      owner: req.token.user._id,  //make sure that no user can delete foreign wallets!
    }).then(() => {
      resp.status(HttpStatus.NO_CONTENT);
      resp.end();
    }).catch(err => {
      log.error("An error occurred while delete a user wallet!", err)

      resp.status(HttpStatus.CONFLICT);
      resp.end();
    })
  });

module.exports = router
