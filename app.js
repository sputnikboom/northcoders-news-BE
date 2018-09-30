const app = require('express')();
const mongoose = require('mongoose');
const {DB_URL} = process.env.DB_URL || require('./config');
const apiRouter = require('./routers/api-router');
const bodyParser = require('body-parser');

mongoose.connect(DB_URL, {useNewUrlParser: true})
.then(() => {
    console.log(`Database ${DB_URL} connected.....`)
})

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/', (req, res, next) => {
    res.sendFile(`${__dirname}/views/home-page.html`)
})

app.use('/*', (req, res, next) => {
    next({status:404});
});

app.use((err, req, res, next) => {
    console.log(err)
    if(err.stats === 400 || err.name === "CastError") res.status(400).send({msg: 'Bad request'})
    else next(err);
})

app.use((err, req, res, next) => {
    if(err.status === 404) res.status(404).send({msg: 'Page not found'})
    else next(err);
});

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg: 'Internal server error'});
    console.log('server error encountered: ', err)
});

module.exports = app;