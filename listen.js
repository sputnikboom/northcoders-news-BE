const app = require('./app')
const PORT = process.env.PORT || 9090;

app.listen(PORT, err => {
    if (err) console.log('error countered: ', err);
    else console.log(`server listening on port ${PORT}`);
});