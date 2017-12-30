const formEl = document.getElementById('form')
const searchEl = document.getElementById('search')
const sortEl = document.getElementById('sort')
searchEl.value = 'price:<2100000 AND data.type=דירה AND publishDate:>=1513209600'
sortEl.value = 'ppm:asc'

formEl.addEventListener('submit', e => {
  e.preventDefault()
  getData()
})

const getParams = () => {
  return {
    q: searchEl.value,
    sort: sortEl.value,
    size: 9999
  }
}

const extraData = data => {
  const items = []
  const check = '<span uk-icon="icon: check"></span>'
  // if (data.id) {
  //   items.push(`ID: ${data.id}`)
  // }
  if (data.publishDate) {
    const pubDate = moment.unix(data.publishDate)
    const pubDateHtml = `<span uk-tooltip title="${pubDate.format('YYYY-MM-DD')}">
      ${pubDate.fromNow()}
    </span>`
    items.push(pubDateHtml)
  }
  if (data.sellerType) {
    items.push(capitalizeFirstLetter(data.sellerType) + (data.exclusive ? ' Exclusive': ''))
  }
  if (data.data.condition) {
    items.push(data.data.condition)
  }
  if (data.data.parkingNum) {
    items.push(check + ' Parking')
  }
  if (data.data.hasBalconies) {
    items.push(check + ' Balconies')
  }
  if (data.data.hasStoreroom) {
    items.push(check + ' Storage')
  }
  if (data.data.airCon) {
    items.push(check + ' Air Conditioner')
  }
  if (data.data.elevator) {
    items.push(check + ' Elevator')
  }
  if (data.data.mamad) {
    items.push(check + ' Mamad')
  }
  if (data.data.grating) {
    items.push(check + ' Grating')
  }
  const html = items.map(i => `<li>${i}</li>`).join('')
  return html
}

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const tableRow = data => {
  const area = (data.data.buildedArea || '') + (data.data.buildedArea && data.data.grossBuildedArea ? '/' : '') + (data.data.grossBuildedArea || '')
  const mapUrl = `http://www.google.com/maps/place/${data.location.lat},${data.location.lng}`
  return `
    <li>
      <div class="uk-accordion-title" uk-grid>
        <span class="uk-width-small">${numeral(data.ppm).format('0,0')}</span>
        <span class="uk-width-small">
          <span uk-tooltip title="${numeral(data.price).format('0,0')}">
            ${numeral(data.price).format('0.0a')}
          </span>
        </span>
        <span class="uk-width-small">${area}</span>
        <span class="uk-width-small">${data.data.floor || '?'}/${data.data.floors || '?'}</span>
        <span class="rtl uk-width-expand">${data.location.formattedAddress}</span>
      </div>
      <div class="uk-accordion-content">
        <div class="rtl">
          ${data.data.remarks}
        </div>
        <ul class="uk-list uk-column-1-4 uk-column-1-6@m">
          ${extraData(data)}
        </ul>
        <div class="rtl">
          <a class="uk-link-text" href="${data.url}" target="_blank" uk-icon="icon: link"></a>
          <a class="uk-link-text" href="${mapUrl}" target="_blank" uk-icon="icon: location"></a>
        </div>
      </div>
    </li>
  `
}

const getData = () => {
  axios.get('/api/es', { params: getParams() })
  .then(({ data }) => {
    let tableHtml = ''
    _.each(data.hits, d => {
      tableHtml += tableRow(d._source)
    })
    document.querySelector('#apartments').innerHTML = tableHtml
  })
  .catch(e => {
    console.error(e)
  })
}

getData()
