# ApartmentSearch

## Installation
* Clone this repo and `yarn install`
* Run `yarn start-elastic` (launches a docker instance in the background)
* Run `yarn fetch`
* Run `yarn start`
* Example search: `http://localhost:9200/apartments/_search?pretty=true&q=*:*&sort=ppm:asc&size=30`
