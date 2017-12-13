# ApartmentSearch

## Installation
* Clone this repo and `yarn install`
* Download [Elasticsearch 6.1.0](https://www.elastic.co/downloads/elasticsearch) to `/elasticsearch`
* Run `yarn start-elastic`
* Run `yarn fetch`
* Example search: `http://localhost:9200/apartments/_search?pretty=true&q=*:*&sort=ppm:asc&size=30`
