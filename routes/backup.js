import express from 'express';
import sqlite3 from 'sqlite3';

sqlite3.verbose();

let router = express.Router();

router.route('/details/:id').get((req, res, next) => {
  console.log(`get reguested from ${req.url}`);

  let id = parseInt(req.params.id, 10);
  let db = new sqlite3.Database('backupPc.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return next({ status: 500, message: 'nu s-a putut conecta la db' });
    }
    console.log('Connected to database');
    db.serialize(() => {
      db.get(
        'SELECT rowid, postDeLucru, denumirePc, serialNo, nrInv, so, status, software, sectia, datetime(dataCurenta, "unixepoch") as dataCurenta FROM backup WHERE rowid = $id',
        { $id: id },
        (err, row) => {
          if (err) {
            return next({ status: 500, message: 'ceva nu a mers bine' });
          }
          res.render('item', {
            title: `ROWID ${id} din tabela backup`,
            message: row == undefined ? { message: 'no such ROWID in db' } : row,
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

router
  .route('/add')
  .get((req, res, next) => {
    console.log(`get reguested from ${req.url}`);

    res.render('addbackup', {
      title: `Adauga backup nou in DB`,
    });
  })
  .post((req, res, next) => {
    console.log(`get reguested from ${req.url}`);

    let db = new sqlite3.Database('backupPc.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        return next({ status: 500, message: 'nu s-a putut conecta la db' });
      }
      console.log('Connected to database');
      db.serialize(() => {
        let stmt = db.prepare(
          'INSERT INTO backup (postDeLucru, denumirePc, serialNo, nrInv, so, status, software, sectia, dataCurenta) VALUES ($postDeLucru, $denumirePc, $serialNo, $nrInv, $so, $status, $software, $sectia, (SELECT unixepoch("now","localtime")))'
        );
        stmt.run({
          $postDeLucru: req.body.postDeLucru,
          $denumirePc: req.body.denumirePc,
          $serialNo: req.body.serialNo,
          $nrInv: req.body.nrInv,
          $so: req.body.so,
          $status: req.body.status,
          $software: req.body.software,
          $sectia: req.body.sectia,
        });
        stmt.finalize();
        res.status(200).json({ status: 200, message: 'Query executed' });
      });
      db.close((err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Close the database connection.');
      });
    });
  });

router.route('/delete/:id').delete((req, res, next) => {
  console.log(`get reguested from ${req.url}`);
  if (req.get('my-passtocheck') != 'parolamea') {
    return next({ status: 401, message: 'Nu ai furnizat parola corecta' });
  }

  let id = parseInt(req.params.id, 10);
  let db = new sqlite3.Database('backupPc.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return next({ status: 500, message: 'nu s-a putut conecta la db' });
    }
    console.log('Connected to database');
    db.serialize(() => {
      let stmt = db.prepare('DELETE FROM backup WHERE rowid = $id');
      stmt.run({ $id: id });
      stmt.finalize();
      res.status(200).json({ status: 200, message: 'Delete executed' });
    });
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  });
});

router.route('/search/:nrinv').get((req, res, next) => {
  console.log(`get reguested from ${req.url}`);

  let nrinv = parseInt(req.params.nrinv, 10);
  let db = new sqlite3.Database('backupPc.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return next({ status: 500, message: 'nu s-a putut conecta la db' });
    }
    console.log('Connected to database');
    db.serialize(() => {
      db.get(
        'SELECT rowid, postDeLucru, denumirePc, serialNo, nrInv, so, status, software, sectia, datetime(dataCurenta, "unixepoch") as dataCurenta FROM backup WHERE nrInv = $nrinv',
        { $nrinv: nrinv },
        (err, row) => {
          if (err) {
            return next({ status: 500, message: 'ceva nu a mers bine' });
          }
          res.render('item', {
            title: `Nr. Inventar ${nrinv} din tabela backup`,
            message: row == undefined ? { message: 'nu exista acest Nr. Inventar in db' } : row,
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
