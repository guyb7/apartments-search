const params = {
  q: 'price:<2000000 AND data.type=דירה',
  sort: 'ppm:asc',
  size: 9999
}

const tableRow = data => {
  const area = (data.data.buildedArea || '') + (data.data.buildedArea && data.data.grossBuildedArea ? '/' : '') + (data.data.grossBuildedArea || '')
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
        ${JSON.stringify(data, null, 2)}
      </div>
    </li>
  `
}

axios.get('/api/es', { params })
.then(({ data }) => {
  let tableHtml = ''
  _.each(data.hits, d => {
    console.log(d._source)
    tableHtml += tableRow(d._source)
  })
  document.querySelector('#apartments').innerHTML = tableHtml
})
.catch(e => {
  console.error(e)
})
