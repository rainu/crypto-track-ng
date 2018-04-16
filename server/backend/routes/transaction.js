const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const log = require('../../../common/log');

const Transaction = require('../../../common/db/model/transaction');

function transform(dbTransaction){
  let t = {
    id: dbTransaction._id,
    href: '/api/transaction/' + dbTransaction._id,
    transaction: {
      ...dbTransaction._doc,
    }
  }
  delete t.transaction['_id']
  delete t.transaction['owner']
  delete t.transaction['__v']

  return t;
}

router.route('/api/transaction')
  //get the transactions of the current user
  .get((req, resp) => {
    Transaction.find({owner: req.token.user._id}).then(transactions => {
      resp.send(transactions.map(t => transform(t)));
    }).catch(err => {
      log.error("An error occurred while request user transactions!", err)

      resp.status(HttpStatus.NOT_FOUND);
      resp.end();
    })
  })

  //create a new transaction for the user
  .post((req, resp) => {
    let transaction = new Transaction({
      owner: req.token.user._id,
      ...req.body
    });

    transaction.save().then(() => {
      resp.location('/api/transaction/' + transaction._id);
      resp.status(HttpStatus.CREATED);
      resp.send(transform(transaction))
    }).catch(err => {
      log.error("An error occurred while create a new user transaction!", err)

      resp.status(HttpStatus.CONFLICT);
      resp.end();
    })
  });

router.route('/api/transaction/:id')
  //gets a given transaction
  .get((req, resp) => {
    Transaction.findOne({
      _id: req.params.id,
      owner: req.token.user._id,  //make sure that no user can get foreign transactions!
    }).then(transaction => {
      if(transaction) {
        resp.send(transform(transaction));
      }else{
        resp.status(HttpStatus.NOT_FOUND);
        resp.end();
      }
    }).catch(err => {
      log.error("An error occurred while getting a user transaction!", err)

      resp.status(HttpStatus.NOT_FOUND);
      resp.end();
    })
  })

  //edit a given transaction
  .put((req, resp) => {
    Transaction.findByIdAndUpdate(req.params.id, {
      owner: req.token.user._id,
      ...req.body
    }).then(transaction => {
      resp.location('/api/transaction/' + req.params.id);
      resp.status(HttpStatus.CREATED);

      Transaction.findById(req.params.id).then(transaction => {
        resp.send(transform(transaction))
      }).catch(err => {
        log.error("An error occurred while getting a user transaction!", err)

        resp.send(transform(transaction))
      })
    }).catch(err => {
      log.error("An error occurred while editing a user transaction!", err)

      resp.status(HttpStatus.CONFLICT);
      resp.end();
    })
  })

  //delete a given transaction
  .delete((req, resp) => {
    Transaction.findOneAndRemove({
      _id: req.params.id,
      owner: req.token.user._id,  //make sure that no user can delete foreign transactions!
    }).then(() => {
      resp.status(HttpStatus.NO_CONTENT);
      resp.end();
    }).catch(err => {
      log.error("An error occurred while delete a user transaction!", err)

      resp.status(HttpStatus.CONFLICT);
      resp.end();
    })
  });

module.exports = router
