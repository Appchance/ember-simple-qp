# ember-simple-qp
Ember query params without cruft!

## Installation:
`ember install ember-simple-qp`

## Usage:

Define in your route **ONLY**:

```javascript
import Ember from 'ember'
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

export default Ember.Route.extend(myQueryParams.Mixin, {
  model(params) {
    // data loading...
  }
})
```

And be happy :)

## Credits:

Inspired by https://github.com/offirgolan/ember-parachute
