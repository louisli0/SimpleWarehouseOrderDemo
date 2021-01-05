const express = require('express');
const app = express();
const PORT = 3200
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var winston = require('winston'), expressWinston = require('express-winston');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
var options = {
  swaggerOptions: {
    validatorUrl: null
  }
}

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

//CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")
  res.header("Access-Control-Allow-Credentials", true)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requsted-With, Content-Type, Accept, Authorization");
  next();
})

//API Routes
app.use('/api', require('./Routes/Api'));

//Static Paths
app.use('assets', express.static('public'));

// Logger
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (te xt: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));


app.get('/', (req, res) => {
  res.send("Hello from express");
})

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
})

module.exports = app