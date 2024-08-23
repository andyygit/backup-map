import express from 'express';
import sqlite3 from 'sqlite3';

sqlite3.verbose();

let router = express.Router();

router.route('/:sectia').get((req, res, next) => {
  console.log(`get reguested from ${req.url}`);

  let sectia = req.params.sectia;
  let db = new sqlite3.Database('backupPc.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return next({ status: 500, message: 'nu s-a putut conecta la db' });
    }
    console.log('Connected to database');
    db.serialize(() => {
      db.all(
        'SELECT rowid, postDeLucru, denumirePc, serialNo, nrInv, so, status, software, sectia, datetime(dataCurenta, "unixepoch") as dataCurenta FROM backup WHERE sectia = $sectia',
        { $sectia: sectia },
        (err, rows) => {
          if (err) {
            return next({ status: 500, message: 'ceva nu a mers bine' });
          }
          res.render('sectia', {
            title: `Sectia: ${sectia}`,
            message: rows,
          });
        }
      );
    });
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  });
});

export { router };
