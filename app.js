const app = require('express')();
const mongoose = require('mongoose');
const {DB_URL} = require('./config');
const apiRouter = require('./routers/api-router');

mongoose.connect(DB_URL, {useNewUrlParser: true})
.then(() => {
    console.log('Database connected.....')
})

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
    next({status:404});
});

app.use((err, req, res, next) => {
    if(err.status === 404) res.status(err.status).send({msg: 'page not found'})
    else next(err);
});

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'internal server error'});
    console.log('server error encountered: ', err)
});

module.exports = app;