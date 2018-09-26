const mongoose = require('mongoose');
const seedDB = require('./seed');
const data = require('./devData');
const {DB_URL} = require('../config');

mongoose.connect(DB_URL, {useNewUrlParser: true})
.then(() => {
    console.log('Connected to database!!!')
    return seedDB(data);
})
.then(() => {
    console.log('Database seeded!!!')
    mongoose.disconnect();
})

