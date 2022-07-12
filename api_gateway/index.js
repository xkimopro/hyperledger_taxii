const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');


const staticFileReader = require('./utils/staticFileReader');
const { checkHeaders } = require('./utils/headers')

const test = require('./routes/test');
const api_root = require('./routes/api_root')

const static_files = new staticFileReader(org = 1)
const app = new express()
const port = 3000


app.use((req,res,next) => {
  req.request_uuid = uuidv4()
  next();
})

// Parse body as application/json
app.use(bodyParser.json())
morgan.token('error_id', (req) => { return req.request_uuid })
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.error_id(req, res)
  ].join(' ')
}))

// Middleware to check for Accept header
app.use(checkHeaders)



// Top level Discovery information must be above /:api_root because both match the pattern
app.get('/taxii2', (req, res) => {
  const discovery_information = static_files.fetchDiscoveryInformation()
  res.send(discovery_information);
  return;
})

// Route handlers
app.use('/test', test);
app.use('/:api_root', api_root)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
