const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const cors = require('cors')
require('dotenv').config()


const app = express()

app.use(bodyParser.json({ limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000}))
app.use(cors())
//static file or image
app.use('/public', express.static(__dirname + '/public'))

//modules
const administrator = require('./routes/administrator')
administrator(app)
const customer = require('./routes/customer')
customer(app)

// catch 404 and forward to error handler
app.use(function(req, res){
    res.status(404).send({url: req.originalUrl + ' NOT FOUND'});
});

//set port
app.set('port','3000')
app.listen(app.get('port'), ()=>{
    console.log('listening on port', app.get('port'))
})

