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

const libs = [
  {
    public: 'axios.min.js',
    module: 'axios/dist/axios.min.js'
  }, {
    public: 'lodash.min.js',
    module: 'lodash/core.min.js'
  }, {
    public: 'moment.min.js',
    module: 'moment/min/moment.min.js'
  }, {
    public: 'numeral.min.js',
    module: 'numeral/min/numeral.min.js'
  }, {
    public: 'uikit.min.js',
    module: 'uikit/dist/js/uikit.min.js'
  }, {
    public: 'uikit-icons.min.js',
    module: 'uikit/dist/js/uikit-icons.min.js'
  }, {
    public: 'uikit.min.css',
    module: 'uikit/dist/css/uikit.min.css'
  }
]

libs.map(l => {
  app.get('/' + l.public, (req, res) => {
    res.sendFile(path.join(__dirname, '../node_modules/' + l.module));
  })
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
