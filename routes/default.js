import express from 'express';
import sqlite3 from 'sqlite3';

sqlite3.verbose();

let router = express.Router();

router.route('/').get((req, res, next) => {
  console.log(`get reguested from ${req.url}`);

  let db = new sqlite3.Database('backupPc.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return next({ status: 500, message: 'nu s-a putut conecta la db' });
    }
    console.log('Connected to database');
    db.serialize(() => {
      db.all('SELECT DISTINCT sectia FROM backup', (err, rows) => {
        if (err) {
          return next({ status: 500, message: 'ceva nu a mers bine' });
        }
        res.render('index', {
          message: rows,
        });
      });
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
