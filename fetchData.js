const _ = require('lodash')
const axios = require('axios')
const moment = require('moment')
const qs = require('qs')
const elasticsearch = require('elasticsearch')

const es = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace',
  apiVersion: '6.0'
})

const APARTMENTS_INDEX = 'apartments'
const SEARCH_URL = 'https://www.madlan.co.il/homes/getData/'
const form = {
  "areaId": "רמת גן",
  "zoom": 15,
  "NELat": 32.09707073730553,
  "NELng": 34.82477808761598,
  "SWLat": 32.07816381999992,
  "SWLng": 34.79679728317262,
  "filter": {
    "dealTypes": ["FOR_SALE"],
    "priceFrom": 1500000,
    "priceTo": 2500000,
    "areaFrom": 75,
    "addProjects": true
  },
  "sortBy": "priceLowToHigh"
  ,"source": "all"
}
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
}

axios({
  url: SEARCH_URL,
  method: 'post',
  data: qs.stringify({ 'json': JSON.stringify(form) }),
  headers
})
.then(response => {
  if (response.data.hasMoreBulletins) {
    console.warn('Not all data was loaded')
  }
  const results = response.data.jointMarkers
  const items = []
  _.each(results, res => {
    if (_.isObject(res)) {
      if (res.type === 'bulletin') {
        const item = {}
        item.id = res.record.id
        item.itemType = res.type
        item.location = res.location
        item.publishDate = moment(res.record.publishDate, "DD/MM/YYYY").unix()
        item.publishDate = moment(res.record.publishDate, "DD/MM/YYYY").unix()
        item.price = res.record.price
        item.ppm = res.record.ppm
        item.sellerType = res.record.sellerType
        item.exclusive = res.record.exclusive
        item.url = res.record.nadlanUrl
        item.data = { ...res.record.features }
        items.push(item)
      } else if (res.type === 'project') {
        const data = res.pois[0]
        const item = {}
        item.id = data.id
        item.name = data.name
        item.itemType = data.type
        item.location = {
          lng: data.lng,
          lat: data.lat
        }
        item.address = data.address
        item.phone = data.phone
        item.url = data.nadlanUrl
        item.info = data.info
        items.push(item)
      } else {
        console.log('Unknown type', res)
      }
    }
  })
  upsertBulk(items)
})
.catch(error => {
  console.error(error)
})

const upsertBulk = items => {
  const bulkBody = []
  _.each(items, i => {
    bulkBody.push({
      update: {
        _index: APARTMENTS_INDEX,
        _type: 'apartment',
        _id: i.id
      }
    })
    bulkBody.push({ doc: i, doc_as_upsert: true })
  })
  es.bulk({
    body: bulkBody
  }).then(response => {
    console.log('Updated ' + response.items.length + ' items')
  }).catch(e => {
    console.error(e)
  })
}