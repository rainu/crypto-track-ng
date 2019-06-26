const router = require('express').Router();
const formidable = require('formidable');
const fs = require('fs');
const HttpStatus = require('http-status-codes');
const log = require('../../../common/log');
const importer = require('../backup/import')
const cointrackingExport = require('../backup/export_cointracking').exportCointracking

router.route('/api/backup')
  //get the backup of the current user
  .get((req, resp) => {
    let exportFn = importer.export
    if(req.query.format === 'cointracking') {
      exportFn = cointrackingExport
    }

    exportFn(req.token.user._id).then(data => {
      resp.send(data)
    }).catch(err => {
      log.error("An error occurred while get backup from user!", err)

      resp.status(HttpStatus.NOT_FOUND);
      resp.end();
    })
  })
  .put((req, resp) => {
    //we have two options:
    //* the json as request-body
    //* the json as file (multipart/fileupload)
    //each one must be handle differently!
    if(req.get("Content-Type").startsWith('multipart/form-data')) {
      // parse a file upload
      let form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
        if(err) {
          log.error("Could not parse backup (multipart/form-data)!", err)

          resp.status(HttpStatus.BAD_REQUEST);
          resp.end();
        } else {
          try {
            let data = JSON.parse(fs.readFileSync(files.file.path, 'utf8'));
            importer.import(data).then(() => {
              resp.status(HttpStatus.CREATED)
              resp.end()
            }).catch(err => {
              log.error("Could not import backup!", err)

              resp.status(HttpStatus.INTERNAL_SERVER_ERROR);
              resp.end();
            })
          }catch(err) {
            log.error("Could not parse backup (multipart/form-data)!", err)

            resp.status(HttpStatus.BAD_REQUEST);
            resp.end();
          }
        }
      });
    }else{
      importer.import(data).then(() => {
        resp.status(HttpStatus.CREATED)
        resp.end()
      }).catch(err => {
        log.error("Could not import backup!", err)

        resp.status(HttpStatus.INTERNAL_SERVER_ERROR);
        resp.end();
      })
    }
  })

module.exports = router
