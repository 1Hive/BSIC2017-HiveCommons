const express = require('express')
const app = express()

// Middleware
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');

// config
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '1mb'}));
app.use(methodOverride());
app.use(helmet());
app.use(cookieParser());

app.use(express.static('build_webpack'))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(8080, function () {
  console.log('App running on port 8080')
})
