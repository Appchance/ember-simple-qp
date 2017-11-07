import Ember from 'ember'

const {
  assign,
  getProperties,
  merge
} = Ember

const {
  keys,
} = Object

import {
  mapValues,
  mapKeys,
  toPairs,
  tinyMixin
} from './utils'


export default class QueryParams {
  constructor() {
    this.queryParams = assign({}, ...arguments)
    this.names = this.names.bind(this)
    this.toArray = this.toArray.bind(this)
    this.byKey = this.byKey.bind(this)

    this.mixinFor = this.mixinFor.bind(this)
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
      qp[key] = getProperties(this.queryParams[key], ['as', 'defaultValue', 'scope'])
      return qp
    })
  }

  _controllerInitialQP() {
    let qpWithValues = mapValues(this.queryParams, ({defaultValue}) => defaultValue)
    return merge(
      qpWithValues,
      mapKeys(qpWithValues, (key) => `${key}_defaultValue`.camelize())
    )
  }

  mixinFor(type) {
    switch(type) {
      case 'route':
        return tinyMixin('queryParams', this._routeQP())
      case 'controller':
        return merge(
          this._controllerInitialQP(),
          tinyMixin('queryParams', this._controllerQP()),
        )
    }
  }

  byKey(key) {
    return this.toArray().find(([qpKey, value]) => value.as == key || qpKey == key)
  }

  names()   { return keys(this.queryParams) }

  toArray() { return toPairs(this.queryParams) }
}
