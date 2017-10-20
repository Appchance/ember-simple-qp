# ember-simple-qp
Ember query params without cruft!

## Installation:
`ember install ember-simple-qp`

## Usage:

Define in your route **ONLY**, and be happy:

```javascript
import Route       from '@ember/routing/route'
import QueryParams from 'ember-simple-qp'

const myQueryParams = new QueryParams({
  pageNumber: {
    as: 'page',
    defaultValue: 1,
    refresh: true
  },
  cityIds: {
    as: 'cities',
    refresh: true,
    replace: true,
    serialize(val) {
      return val.toString()
    },
    deserialize(urlVal) {
      return urlVal.split(',')
    }
  }
})

export default Route.extend(myQueryParams.Mixin, {
  model(params) {
    // data loading...
  }
})
```

QueryParams object is extensible:

```javascript
// app/routes/users.js
import Route                  from '@ember/routing/route'
import PaginationQueryParams  from 'my-app/query-params/pagination'

const specializedPaginationQueryParams = PaginationQueryParams.extend({
  filterQ: {
    as: 'q',
    defaultValue: '',
    refresh: true
  }
})

export default Route.extend(specializedPaginationQueryParams.Mixin, {
  model(params) {
    // data loading...
  }
})

```

From now, you will be able to access `resetQueryParams()` function, and `allQueryParams` property:

```javascript
// app/controllers/users.js
import Controller from '@ember/controller'

export default Controller.extend({
  actions: {
    resetFilters() {
      // returns EmberObject with qp names as keys with corresponding values
      this.get('allQueryParams')

      // will restore all qps to their default values
      this.resetQueryParams()
    }
  }
});

```

## Credits:

Inspired by https://github.com/offirgolan/ember-parachute
