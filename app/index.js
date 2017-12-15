const path = require('path')
const express = require('express')
const axios = require('axios')
const elasticsearch = require('elasticsearch')

const app = express()
const es = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace',
  apiVersion: '6.0'
})

app.get('/axios.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/axios/dist/axios.min.js'));
})
app.get('/lodash.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/lodash/core.min.js'));
})
app.get('/numeral.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/numeral/min/numeral.min.js'));
})
app.get('/uikit.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/uikit/dist/js/uikit.min.js'));
})
app.get('/uikit.min.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/uikit/dist/css/uikit.min.css'));
})

app.get('/api/es', (req, res) => {
  es.search({
    index: 'apartments',
    ...req.query
  }).then(response => {
    res.json(response.hits)
  })
  .catch(e => {
    console.error(e)
    res.status(500).json({ success: false })
  })
})

app.use('/', express.static(path.join(__dirname, 'static')))

app.listen(3400, () => console.log('Listening on port 3400'))
