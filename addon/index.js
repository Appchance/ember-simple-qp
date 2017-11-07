import Ember        from 'ember'
import QueryParams  from './query-params'

import {
  SQP_KEY,
  tinyMixin,
  ensureControllerExistence
} from './utils'

const {
  Mixin,
  computed,
} = Ember

const {
  alias
} = computed

const sqpMixin = (sqp) => tinyMixin(SQP_KEY, sqp)

const prepareRoute = (route, sqp) => {
  if(route.get(SQP_KEY) || sqp.names().length == 0) return
  route.reopen(sqpMixin(sqp))
  route.reopen(sqp.mixinFor('route'))
  route.reopen({
    allQueryParams:     alias('controller.allQueryParams'),

    serializeQueryParam(value, urlKey) {
      let [_, options] = this.get(SQP_KEY).byKey(urlKey)
      if(options && options.serialize) return options.serialize(value)

      return this._super(...arguments)
    },

    deserializeQueryParam(value, urlKey) {
      let [_, options] = this.get(SQP_KEY).byKey(urlKey)
      if(options && options.deserialize) return options.deserialize(value)

      return this._super(...arguments)
    },
  })
}

const prepareController = (route) => {
  let controller = ensureControllerExistence(route)
  let sqp = route.get(SQP_KEY)
  if(!sqp || controller.get(SQP_KEY) || sqp.names().length == 0) return
  let qpNames = sqp.names()

  controller.reopen(sqpMixin(sqp))
  controller.reopen(sqp.mixinFor('controller'))

  controller.reopen({
    allQueryParams: computed(...qpNames, function() {
      return this.getProperties(qpNames)
    }),

    resetQueryParams() {
      qpNames.forEach(key => this.set(key, this.get(`${key}_defaultValue`.camelize())))
    }
  })
}

export default Mixin.create({
  mergedProperties:   ['simpleQueryParams'],
  simpleQueryParams:  {},

  init() {
    this._super(...arguments)
    prepareRoute(this, new QueryParams(this.get('simpleQueryParams')))
  },

  _qp: computed(function() {
    prepareController(this)
    return this._super(...arguments)
  }),
})
