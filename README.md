# ember-simple-qp
Ember query params without cruft!

## Installation:
`ember install ember-simple-qp`

## Usage:

Define in your route **ONLY**, and be happy:

```javascript
import Route       from '@ember/routing/route'

export default Route.extend({
  simpleQueryParams: {
    pageNumber: {
      as: 'page',
      defaultValue: 1,
      refresh: true
    },
    pageSize: {
      as: 'per',
      defaultValue: 20,
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
  }

  model(params) {
    // data loading...
  }
})
```

`simpleQueryParams` property is a `mergedProperty`. You can add new query params on multiple levels:

```javascript
// app/routes/users.js
import Route                  from '@ember/routing/route'
import PaginatedRoute         from 'my-app/mixins/paginated-route'

export default Route.extend(PaginatedRoute, {
  simpleQueryParams: {
    filterQ: {
      as: 'q',
      defaultValue: '',
      refresh: true
    }
  }

  model(params) {
    // data loading...
  }
})

```

You can also override query params in a particular route. For instance:

```javascript
// app/routes/users.js
import Route                  from '@ember/routing/route'
import PaginatedRoute         from 'my-app/mixins/paginated-route'

export default Route.extend(PaginatedRoute, {
  simpleQueryParams: {
    pageSize: {
      as: 'per',
      defaultValue: 200, // new default value. We wanna a BIG page here
      refresh: true
    },
  }

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
