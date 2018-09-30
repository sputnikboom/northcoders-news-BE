const app = require('express')();
const mongoose = require('mongoose');
const {DB_URL} = require('./config');
const apiRouter = require('./routers/api-router');
const bodyParser = require('body-parser');

/**
 * hosting on heroku and mlabs
 * 
 * -> create new
 * -> pick amazon, google, or azure
 * -> pick one that has a closer server
 * -> make a database user, make yourself a username
 * -> make a production env in ur config, include the url from mlabs
 * -> paul's gonna send us a bunch o' stufffff
 * 
 * ----> in the readme
 * ->pre-requesits (eg. node (min verion 8.1.2, 8.12???)), mongo v. 4.4~
 * -> package json with dependencies, (express, body-parser etc)
 * -> install, clone, npm install, run seed file
 * -> remember the config has been git-ignored, tell the reader how to make one
 * (eb. $ mkdir config)
 * have server serve up api reference, basic html file that describes the different endpoints
 * dob't need to use res.render or ejs 'cos these can be super simple
 * res.sendFile($__dirname}/views/home.html)
 */

mongoose.connect(DB_URL, {useNewUrlParser: true})
.then(() => {
    console.log(`Database ${DB_URL} connected.....`)
})

app.use(bodyParser.json());

app.use('/api', apiRouter);

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