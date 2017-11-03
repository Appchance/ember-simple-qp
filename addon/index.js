import Ember from 'ember'

const {
  Mixin,
  assign,
  computed,
  defineProperty,
  getProperties,
  getOwner
} = Ember

const {
  alias
} = computed

const {
  keys,
  values
} = Object

const QUERY_PARAMS_KEY = '_queryParams'

const mapValues = function(obj, fn) {
  let newObj = {}
  keys(obj).forEach(key => newObj[key] = fn(obj[key]))
  return newObj
}

const toPairs = function(obj) { return keys(obj).map(key => [key, obj[key]]) }

export default class QueryParams {
  constructor() {
    this.queryParams = assign({}, ...arguments)
    this.Mixin = this._generateMixin()
  }

  extend() {
    return new QueryParams(this.queryParams, ...arguments)
  }

  _generateMixin() {
    let qp                  = this
    let controllerQP        = this._controllerQP()
    let routeQP             = this._routeQP()
    let controllerInitialQP = this._controllerInitialQP()
    let qpNames             = this._qpNames()

    return Mixin.create({
      mergedProperties: ['_queryParams'],

      _queryParams: qp,
      queryParams:  routeQP,

      allQueryParams: alias('controller.allQueryParams'),

      _qp: computed(function() {
        let controllerName = this.controllerName || this.routeName
        let controller = this.controllerFor(controllerName, true) || this.generateController(controllerName)

        if(!controller.get(QUERY_PARAMS_KEY)) {
          controller.reopen(controllerInitialQP)

          defineProperty(controller, 'allQueryParams', computed(...qpNames, function() {
            return this.getProperties(qpNames)
          }))

          controller.reopen({
            _queryParams: qp,

            queryParams: qpNames,

            resetQueryParams() {
              this.get(QUERY_PARAMS_KEY)
              ._qpNames()
              .forEach((key, {defaultValue}) => this.set(key, defaultValue))
            }
          })
        }
        return this._super(...arguments)
      }),

      serializeQueryParam(value, urlKey, defaultValueType) {
        let qp = this.get(QUERY_PARAMS_KEY).qpByKey(urlKey)
        if(qp && qp.serialize) return qp.serialize(value)

        return this._super(...arguments)
      },

      deserializeQueryParam(value, urlKey, defaultValueType) {
        let qp = this.get(QUERY_PARAMS_KEY).qpByKey(urlKey)
        if(qp && qp.deserialize) return qp.deserialize(value)

        return this._super(...arguments)
      },
    })
  }

  qpByKey(key) {
    return toPairs(this.queryParams).find(([qpKey, value]) => value.as == key || qpKey == key)[1]
  }

  _routeQP() {
    return mapValues(this.queryParams, (obj) => {
      obj.refreshModel = obj.refresh
      return getProperties(obj, ['as', 'refreshModel', 'replace'])
    })
  }

  _controllerQP() {
    return keys(this.queryParams).map(key => {
      let qp = {}
      qp[key] = getProperties(this.queryParams[key], ['as', 'defaultValue'])
      return qp
    })
  }

  _controllerInitialQP() {
    return mapValues(
      this.queryParams,
      ({defaultValue}) => defaultValue
    )
  }

  _qpNames() { return keys(this.queryParams) }
  _qpArray() { return toPairs(this.queryParams) }
}
