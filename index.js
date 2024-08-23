import express, { json } from 'express';
import { router as homeRouter } from './routes/default.js';
import { router as backupRouter } from './routes/backup.js';
import { router as sectiaRouter } from './routes/sectia.js';

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json());

//routes
app.use('/', homeRouter);
app.use('/sectia', sectiaRouter);
app.use('/backup', backupRouter);

//redirects
app.all('*', (req, res) => {
  res.status(404).send('<h3>404 Not found!</h3>');
});

//errors
app.use((err, req, res, next) => {
  res.status(err.status).json(err);
  console.error(err.message);
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
